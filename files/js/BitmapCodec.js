/**
 * 函数棋 - Function Chess
 * Copyright (C) 2024 shaihai-studio
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * BitmapCodec - 位图分层编码（稠密分布优化）
 *
 * 编码策略：
 * - 第一层：每格1bit表示是否非空（0=空，1=有值）
 * - 第二层：非空格用1bit区分类型（0=目标，1=禁止）
 *
 * 压缩效果：
 * - 50%非零：400格 → 200bit(掩码) + 100bit(类型) = 300bit（节省25%）
 * - 80%非零：400格 → 400bit(掩码) + 320bit(类型) = 720bit（节省10%）
 */
class BitmapCodec {
    static encode(map) {
        const bs = new BitStream();

        // 第一层：非零掩码
        const nonZeroIndices = [];
        for (let i = 0; i < map.length; i++) {
            const isNonZero = map[i] !== 0;
            bs.writeBits(isNonZero ? 1 : 0, 1);
            if (isNonZero) nonZeroIndices.push(i);
        }

        // 第二层：非零格类型（1→0, 2→1）
        for (const idx of nonZeroIndices) {
            bs.writeBits(map[idx] === 2 ? 1 : 0, 1);
        }

        return bs;
    }

    static decode(bs, totalCells) {
        const map = [];

        // 读取非零掩码
        const nonZeroMask = [];
        for (let i = 0; i < totalCells; i++) {
            nonZeroMask.push(bs.readBits(1));
        }

        // 读取非零格类型
        for (let i = 0; i < totalCells; i++) {
            if (nonZeroMask[i] === 0) {
                map.push(0);
            } else {
                const type = bs.readBits(1);
                map.push(type === 0 ? 1 : 2);
            }
        }

        return map;
    }
}
