const fs = require('fs');
const path = require('path');

module.exports = function loadPlugins() {
  // 获取当前文件的绝对路径
  const currentDirPath = path.dirname(__filename);

  // 指定要读取的目录
  const directoryPath = path.join('src/plugins');

  function readFiles(dir) {
    let content = '';

    // 读取目录下的所有文件和子目录
    const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
      const filePath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // 如果是子目录，则递归读取
        content += readFiles(filePath);
      } else if (entry.isFile() && path.extname(entry.name) === '.js') {
        // 只处理 .js 文件
        const fileContent = fs.readFileSync(filePath, 'utf8');
        content += '(function () {\n' + fileContent + '\n})();' + '\n'; // 这里用换行符分隔每个文件的内容
      }
    }

    return content;
  }

  try {
    const content = readFiles(directoryPath);
    return content;
  } catch (err) {
    console.error('Error reading files:', err);
    return '';
  }
}
