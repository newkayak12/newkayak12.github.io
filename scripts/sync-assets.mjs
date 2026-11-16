// 루트의 assets/ 를 public/assets 로 복사한다. assets/ 는 Obsidian 볼트에서도 쓰므로 위치를 옮기지 않는다.
import fs from 'node:fs';
fs.rmSync('public/assets', { recursive: true, force: true });
fs.mkdirSync('public', { recursive: true });
fs.cpSync('assets', 'public/assets', { recursive: true });
console.log('assets → public/assets');
