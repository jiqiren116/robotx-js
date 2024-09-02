// const fetch = require('node-fetch'); // 导入 node-fetch 模块
import fetch from 'node-fetch'; // 导入 node-fetch 模块
// const fs = require('fs'); // 导入 fs 模块，用于文件系统操作
import fs from 'fs'; // 导入 fs 模块，用于文件系统操作

// 随机延迟函数
function randomDelay(min, max) {
    const delay = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
}

// 定义API URL模板
// const apiUrlTemplate = 'https://www.ximalaya.com/revision/album/v1/getTracksList?albumId={albumId}&pageNum={pageNum}&pageSize=100';
// https://www.ximalaya.com/revision/album/v1/getTracksList?albumId=12817863&pageNum=1&pageSize=100

// 获取专辑ID
const albumId = 3558668; // 示例ID，请替换为你实际需要的专辑ID

// 获取总页数
function getTotalPages(totalCount) {
    return Math.ceil(totalCount / 100); // 根据总条目数计算总页数
}

// 抓取单页数据
async function fetchPage(pageNum) {
    const url = apiUrlTemplate.replace('{albumId}', albumId).replace('{pageNum}', pageNum); // 替换 URL 中的占位符
    // const url = 'http://192.168.117.70:8080/workhours/approve/getList'
    // const url = 'https://jsonplaceholder.typicode.com/todos/';

    const response = await fetch(url); // 发起 GET 请求
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = response.json(); // 直接解析 JSON 数据
    console.log(`Fetched page ${pageNum} success`);
    return data.data.tracks; // 返回数据中的 tracks 列表
}


// 主逻辑
async function main() {
    try {
        // 获取第一页数据以确定总条目数
        const firstPageData = await fetchPage(1); // 获取第一页数据
        const trackTotalCount = firstPageData.trackTotalCount; // 获取总条目数

        // 计算总页数
        const totalPages = getTotalPages(trackTotalCount); // 计算总页数

        // 初始化数组存储所有数据
        let allTracks = []; // 初始化空数组存储所有音轨数据

        // 逐页抓取数据
        for (let i = 1; i <= totalPages; i++) {
            // 添加随机延时
            randomDelay(1000, 3000);

            const tracks = await fetchPage(i); // 获取当前页的数据
            allTracks = allTracks.concat(tracks); // 将当前页的数据合并到 allTracks 数组中

            // 保存当前页的数据到本地文件
            fs.writeFile(`tracks_page_${i}.json`, JSON.stringify(tracks, null, 2), (err) => {
                if (err) throw err; // 如果写入文件出错，则抛出错误
                console.log(`数据已保存到本地文件 tracks_page_${i}.json`); // 输出保存成功的提示信息
            });
        }

        // 按播放量降序排序
        allTracks.sort((a, b) => b.playCount - a.playCount); // 对所有音轨数据按播放量降序排序

        // 将数据保存到本地文件
        fs.writeFile(`tracks_sorted.json`, JSON.stringify(allTracks, null, 2), (err) => {
            if (err) throw err; // 如果写入文件出错，则抛出错误
            console.log('数据已保存到本地文件 tracks_sorted.json'); // 输出保存成功的提示信息
        });
    } catch (error) {
        console.error('发生错误:', error); // 如果出现任何错误，输出错误信息
    }
}


main();