const fs = require('fs');
const path = require('path');
const isDev = process.argv.some(arg => arg.includes('--dev'));

module.exports = function loadPlugins() {
  let directoryPath = path.join('./src/plugins');
  // 指定要读取的目录
  if (!isDev) {
    directoryPath = path.join(process.resourcesPath, 'plugins');
  }

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
        content += '(function () {\ntry {\n' + fileContent + '\n} catch (error) {console.error(\'An error occurred:\', error);}\n})();' + '\n'; // 这里用换行符分隔每个文件的内容
      }
    }

    return content;
  }

  return readFiles(directoryPath);
}
