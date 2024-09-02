// 读取 temp.json 文件并进行排序
// const fs = require('fs');
import fs from 'fs'; // 导入 fs 模块，用于文件系统操作

function parseData() {
    // 读取文件内容
    fs.readFile('temp.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        // 将文件内容存储在变量中
        let rawJson = data;

        // 使用正则表达式匹配所有独立的JSON对象
        let jsonParts = rawJson.match(/{[^{}]*}/g);

        if (jsonParts) {
            // 将所有JSON对象解析为JavaScript对象并存储在数组中
            let jsonArray = jsonParts.map(part => JSON.parse(part));

            // 按照playCount字段从大到小排序
            jsonArray.sort((a, b) => b.playCount - a.playCount);

            // 打印排序后的结果
            jsonArray.forEach((item, index) => {
                console.log(`排序号 ${index + 1}:`);
                console.log(`名称: ${item.title}`);
                // console.log(`播放量: ${item.playCount}`);
                console.log('\n'); // 添加空行以增加可读性
            });


            // 将排序后的结果保存到一个新的 JSON 文件中
            fs.writeFile('sorted.json', JSON.stringify(jsonArray, null, 2), (writeErr) => {
                if (writeErr) {
                    console.error("Error writing file:", writeErr);
                } else {
                    console.log("排序后的结果已保存到 sorted.json 文件中");
                }
            });
        } else {
            console.log("没有找到有效的JSON对象");
        }
    });
}

parseData();