import { configure } from '@storybook/react'

function loadStories() {
  require('../src/stories/index.tsx') // 指定 story 的位置
  // 可以是任意目录，根据自己需要写路径
}

configure(loadStories, module)
