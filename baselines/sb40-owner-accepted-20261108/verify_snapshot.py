#!/usr/bin/env python3
"""Read-only SB40 checkpoint integrity checks; never builds or touches a device."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess

BASE = Path(__file__).resolve().parent
ROOT = BASE.parent.parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--original', action='store_true', help='Also check retained source and original seven-file dirty state on the Mac.')
parser.add_argument('--artifacts', action='store_true', help='Hash retained artifact files, not installed device files.')
parser.add_argument('--index', action='store_true', help='Check staged Git blob bytes and executable modes.')
args = parser.parse_args()
manifest = json.loads((BASE / 'source-manifest.json').read_text())
errors = []

def digest(data):
    return hashlib.sha256(data).hexdigest()

def verify(path, item, label):
    if path.is_symlink() or not path.is_file():
        errors.append(f'{label}: absent or symlink: {item["path"]}')
    elif digest(path.read_bytes()) != item['sha256'] or path.stat().st_size != item['size']:
        errors.append(f'{label}: bytes differ: {item["path"]}')
    elif bool(path.stat().st_mode & 0o111) != item['executable']:
        errors.append(f'{label}: executable mode differs: {item["path"]}')

expected = {item['path'] for item in manifest['files']}
actual = {str(p.relative_to(BASE / 'source')) for p in (BASE / 'source').rglob('*') if p.is_file() or p.is_symlink()}
if actual != expected:
    errors.append(f'File set differs: extra={sorted(actual - expected)}, missing={sorted(expected - actual)}')
for item in manifest['files']:
    path = BASE / 'source' / item['path']
    verify(path, item, 'snapshot')
    if args.original:
        verify(Path(manifest['source_path']) / item['path'], item, 'original')
    if args.index:
        rel = str(path.relative_to(ROOT))
        blob = subprocess.check_output(['git', 'show', ':' + rel], cwd=ROOT)
        if digest(blob) != item['sha256']:
            errors.append(f'Git index bytes differ: {rel}')
        mode = subprocess.check_output(['git', 'ls-files', '--stage', '--', rel], cwd=ROOT).decode().split()[0]
        if (mode == '100755') != item['executable']:
            errors.append(f'Git index mode differs: {rel}')
if args.original:
    saved = json.loads((BASE / 'main-checkout-preservation.json').read_text())
    main = Path(manifest['source_path']).parent / 'app'
    def git(*cmd):
        return subprocess.check_output(['git', *cmd], cwd=main)
    if git('rev-parse', 'HEAD').decode().strip() != saved['head']:
        errors.append('Main checkout HEAD changed')
    if git('branch', '--show-current').decode().strip() != saved['branch']:
        errors.append('Main checkout branch changed')
    if git('status', '--porcelain=v1', '-z').decode() != saved['status']:
        errors.append('Main checkout dirty status changed')
    if digest(git('diff', '--binary')) != saved['unstaged_diff_sha256']:
        errors.append('Main checkout unstaged diff changed')
    if digest(git('diff', '--cached', '--binary')) != saved['staged_diff_sha256']:
        errors.append('Main checkout index changed')
    for item in saved['dirty_files']:
        verify(main / item['path'], item, 'main dirty file')
if args.artifacts:
    provenance = json.loads((BASE / 'artifact-provenance.json').read_text())
    for artifact in provenance['artifacts']:
        path = Path(artifact['path'])
        if not path.is_file() or digest(path.read_bytes()) != artifact['expected_sha256']:
            errors.append(f'Retained artifact differs: {path}')
print(json.dumps({'status': 'FAIL' if errors else 'PASS', 'source_files': len(manifest['files']), 'original_checked': args.original, 'retained_artifacts_checked': args.artifacts, 'git_index_checked': args.index, 'errors': errors}, indent=2))
raise SystemExit(bool(errors))
