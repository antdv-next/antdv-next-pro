<docs lang="zh-CN">
`findChunks` 接管区间查找，可以接入拼音首字母、去变音符、模糊搜索，或者直接使用后端返回的高亮偏移量。返回的区间左闭右开，仍会经过清洗与重叠合并。
</docs>

<docs lang="en-US">
`findChunks` takes over range finding: plug in pinyin initials, diacritic folding, fuzzy search, or offsets returned by the server. Ranges are half-open and are still sanitized and merged.
</docs>

<script setup lang="ts">
import type { HighlightFindChunks, HighlightRange } from '@antdv-next/pro/highlight'

const DIACRITICS = /\p{M}/gu

function fold(value: string) {
  return value.normalize('NFD').replace(DIACRITICS, '').toLowerCase()
}

// 忽略变音符匹配。逐个 UTF-16 码元折叠并保持长度不变，返回的区间可以直接对应原文。
const foldDiacritics: HighlightFindChunks = ({ content, keywords }) => {
  const folded = content.split('').map((char) => {
    const value = fold(char)
    return value.length === 1 ? value : char.toLowerCase()
  }).join('')
  const ranges: HighlightRange[] = []
  for (const keyword of keywords) {
    if (typeof keyword !== 'string')
      continue
    const needle = fold(keyword)
    if (!needle)
      continue
    let index = folded.indexOf(needle)
    while (index > -1) {
      ranges.push({ start: index, end: index + needle.length, keyword })
      index = folded.indexOf(needle, index + needle.length)
    }
  }
  return ranges
}

// 后端已经给出命中偏移量时，直接返回即可。
const serverOffsets: HighlightFindChunks = () => [{ start: 0, end: 4 }, { start: 12, end: 18 }]
</script>

<template>
  <a-flex vertical gap="small">
    <a-highlight content="Crème brûlée and creme brulee" keywords="creme brulee" :find-chunks="foldDiacritics" />
    <a-highlight content="Vite powers modern tooling." :find-chunks="serverOffsets" />
  </a-flex>
</template>
