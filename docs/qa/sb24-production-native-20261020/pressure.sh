cat /dev/zero >> files/sb24-pressure.bin
first=$?
echo FIRST_WRITE_EXIT=$first
df -k /data
mv files/command.json files/release.json || exit 4
end=$(( $(date +%s) + 90 ))
i=0
while [ -e files/enospc-reserve.bin ] && [ ! -e files/result.json ] && [ $(date +%s) -lt $end ]; do
 cat /dev/zero >> files/sb24-pressure.bin 2>/dev/null
 i=$((i+1))
done
echo PRESSURE_WRITES=$i
df -k /data
