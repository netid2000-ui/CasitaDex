// Bundle the original SVG file as text; no vector paths or dimensions are changed.
// Android resource names are not fetchable URLs, so SVG rendering must not fetch them.
const upstream=require('@expo/metro-config/babel-transformer');
module.exports.transform=args=>upstream.transform(args.filename.endsWith('.svg')?{...args,src:`module.exports = ${JSON.stringify(args.src)};`}:args);
