import * as fs from "fs/promises";
import * as path from "path";

// 定义要扫描的图片文件扩展名 (小写)
const IMAGE_EXTENSIONS: Set<string> = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".bmp",
  ".ico",
  ".avif",
]);

/**
 * 将文件大小（字节）格式化为人类可读的字符串，最小单位为KB
 * @param bytes - 文件大小（以字节为单位）
 * @returns 格式化后的字符串 (e.g., "123.00 KB", "4.50 MB")
 */
function formatSize(bytes: number): string {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (bytes >= GB) {
    return `${(bytes / GB).toFixed(2)} GB`;
  }
  if (bytes >= MB) {
    return `${(bytes / MB).toFixed(2)} MB`;
  }
  // 始终以KB为最小单位显示
  return `${(bytes / KB).toFixed(2)} KB`;
}

/**
 * 递归地处理目录，打印符合条件的图片文件和大小
 * @param directoryPath - 要处理的目录路径
 * @param minSizeKB - 最小文件大小过滤（KB），0表示不过滤
 * @param prefix - 用于格式化输出的层级前缀
 */
async function processDirectory(
  directoryPath: string,
  minSizeKB: number,
  prefix: string = ""
): Promise<void> {
  try {
    const dirents = await fs.readdir(directoryPath, { withFileTypes: true });

    for (const dirent of dirents) {
      // 忽略常见的开发/系统文件夹
      if (
        dirent.name === "node_modules" ||
        dirent.name === ".git" ||
        dirent.name.startsWith(".")
      ) {
        continue;
      }

      const fullPath = path.join(directoryPath, dirent.name);

      if (dirent.isDirectory()) {
        console.log(`${prefix}- ${dirent.name}`);
        await processDirectory(fullPath, minSizeKB, `${prefix}  `);
      } else if (dirent.isFile()) {
        const extension = path.extname(dirent.name).toLowerCase();

        if (IMAGE_EXTENSIONS.has(extension)) {
          try {
            const stats = await fs.stat(fullPath);
            const sizeInKB = stats.size / 1024;

            if (sizeInKB >= minSizeKB) {
              console.log(
                `${prefix}  -- ${dirent.name.padEnd(25, " ")}\t${formatSize(
                  stats.size
                )}`
              );
            }
          } catch (statError) {
            console.log(
              `${prefix}  -- ${dirent.name.padEnd(25, " ")}\t[无法读取大小]`
            );
          }
        }
      }
    }
  } catch (err) {
    // 忽略权限错误等，仅打印可访问的目录信息
    // console.error(`无法读取目录 ${directoryPath}:`, err);
  }
}

/**
 * 主函数
 */
async function main() {
  // --- 配置区域: 在此处修改您的设置 ---

  // 1. 要分析的目录路径。
  //    - 使用 '.' 表示当前脚本所在的目录
  //    - 使用绝对路径，例如: 'C:/Users/YourUser/Pictures' (Windows)
  //    - 使用绝对路径，例如: '/Users/youruser/Documents' (macOS/Linux)
  const analysisPath: string = "";

  // 2. 最小文件大小过滤 (单位: KB)。
  //    - 设置为 0 可显示所有找到的图片文件。
  //    - 设置为 100 可只显示大于 100KB 的文件。
  const minSizeKB: number = 100;

  // --- 配置结束 ---

  const absolutePath = path.resolve(analysisPath);
  console.log(`分析目录: ${absolutePath}`);
  if (minSizeKB > 0) {
    console.log(`筛选条件: 只显示大于 ${minSizeKB} KB 的图片`);
  }
  console.log("------------------------------------");

  await processDirectory(absolutePath, minSizeKB);

  console.log("------------------------------------");
  console.log("分析完成。");
}

// 启动脚本
main();
