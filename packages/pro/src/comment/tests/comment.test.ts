import type { CommentProps } from '../types'
import { mount } from '@vue/test-utils'
import { Button, ConfigProvider } from 'antdv-next'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import rtlTest from '../../../../../tests/shared/rtlTest'
import { ProConfigProvider } from '../../index'
import Comment from '../index'

const semanticClasses: CommentProps['classes'] = {
  root: 'c-root',
  inner: 'c-inner',
  avatar: 'c-avatar',
  content: 'c-content',
  header: 'c-header',
  author: 'c-author',
  datetime: 'c-datetime',
  body: 'c-body',
  actions: 'c-actions',
  children: 'c-children',
}

function mountFull(props: CommentProps = {}, slots: Record<string, () => any> = {}) {
  return mount(Comment, {
    props: {
      author: 'Zhang San',
      datetime: '5 minutes ago',
      content: 'This is a comment.',
      ...props,
    },
    slots,
  })
}

describe('Comment', () => {
  it('renders author, avatar, datetime and content from props', () => {
    const wrapper = mountFull({ avatar: 'https://example.com/avatar.png' })

    expect(wrapper.find('.ant-comment-author').text()).toBe('Zhang San')
    expect(wrapper.find('.ant-comment-datetime').text()).toBe('5 minutes ago')
    expect(wrapper.find('.ant-comment-body').text()).toBe('This is a comment.')
  })

  it('renders actions only through the #actions slot', () => {
    const wrapper = mountFull({}, {
      actions: () => [
        h(Button, { type: 'text', size: 'small' }, { default: () => 'Like' }),
        h(Button, { type: 'text', size: 'small' }, { default: () => 'Reply' }),
      ],
    })

    const actions = wrapper.findAll('.ant-comment-actions .ant-space-item')
    expect(actions).toHaveLength(2)
    expect(actions.map(action => action.text())).toEqual(['Like', 'Reply'])
  })

  it('carries click handlers from the #actions slot', async () => {
    const onDelete = vi.fn()
    const wrapper = mountFull({}, {
      actions: () => h(Button, { type: 'text', size: 'small', onClick: onDelete }, { default: () => 'Delete' }),
    })

    await wrapper.find('.ant-comment-actions .ant-btn').trigger('click')
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('keeps the actions container to Space and lets arbitrary content through', () => {
    const wrapper = mountFull({}, {
      actions: () => [h('span', { class: 'plain-action' }, '打赏'), h('a', { href: '#top' }, '置顶')],
    })

    const container = wrapper.find('.ant-comment-actions')
    expect(container.classes()).toContain('ant-space')
    // 组件不再解析字符串，任何内容都原样透出，由使用方负责控件语义
    expect(wrapper.find('.plain-action').text()).toBe('打赏')
    expect(wrapper.find('.ant-comment-actions a').attributes('href')).toBe('#top')
  })

  it('renders the string avatar through Avatar and derives the image alt from author', () => {
    const wrapper = mountFull({ avatar: 'https://example.com/avatar.png' })

    const avatar = wrapper.find('.ant-comment-avatar .ant-avatar')
    expect(avatar.exists()).toBe(true)
    expect(avatar.classes()).toContain('ant-comment-avatar-inner')
    expect(wrapper.find('.ant-comment-avatar img').attributes('alt')).toBe('Zhang San')
  })

  it('lets slots win over the same-named props', () => {
    const wrapper = mountFull({}, {
      avatar: () => h('span', { class: 'slot-avatar' }, 'ZS'),
      author: () => h('span', { class: 'slot-author' }, 'Slot author'),
      datetime: () => h('span', { class: 'slot-datetime' }, 'Slot datetime'),
      content: () => h('span', { class: 'slot-content' }, 'Slot content'),
      actions: () => h('button', { class: 'slot-action' }, 'Slot action'),
    })

    expect(wrapper.find('.slot-author').text()).toBe('Slot author')
    expect(wrapper.find('.slot-datetime').text()).toBe('Slot datetime')
    expect(wrapper.find('.slot-content').text()).toBe('Slot content')
    expect(wrapper.find('.slot-action').exists()).toBe(true)

    // props 的对应内容不应再出现在 DOM 中
    expect(wrapper.text()).not.toContain('Zhang San')
    expect(wrapper.text()).not.toContain('5 minutes ago')
    expect(wrapper.text()).not.toContain('This is a comment.')

    // 插槽头像替换掉默认的 Avatar
    expect(wrapper.find('.slot-avatar').exists()).toBe(true)
    expect(wrapper.find('.ant-comment-avatar .ant-avatar').exists()).toBe(false)
  })

  it('renders the header even when the actions slot is absent', () => {
    const wrapper = mountFull()

    expect(wrapper.find('.ant-comment-header').exists()).toBe(true)
    // actions 是纯插槽，没有插槽时整个容器不渲染
    expect(wrapper.find('.ant-comment-actions').exists()).toBe(false)
  })

  it('applies every semantic class and style to its own node', () => {
    const wrapper = mountFull(
      {
        avatar: 'https://example.com/avatar.png',
        classes: semanticClasses,
        styles: { body: { color: 'rgb(1, 2, 3)' } },
      },
      {
        actions: () => h('span', { class: 'semantic-action' }, 'Like'),
        default: () => h(Comment, { content: 'nested' }),
      },
    )

    expect(wrapper.find('.ant-comment').classes()).toContain('c-root')
    expect(wrapper.find('.ant-comment-inner').classes()).toContain('c-inner')
    expect(wrapper.find('.ant-comment-avatar').classes()).toContain('c-avatar')
    expect(wrapper.find('.ant-comment-content').classes()).toContain('c-content')
    expect(wrapper.find('.ant-comment-header').classes()).toContain('c-header')
    expect(wrapper.find('.ant-comment-author').classes()).toContain('c-author')
    expect(wrapper.find('.ant-comment-datetime').classes()).toContain('c-datetime')
    expect(wrapper.find('.ant-comment-body').classes()).toContain('c-body')
    expect(wrapper.find('.ant-comment-actions').classes()).toContain('c-actions')
    expect(wrapper.find('.ant-comment-children').classes()).toContain('c-children')

    expect(wrapper.find('.ant-comment-body').attributes('style')).toContain('color: rgb(1, 2, 3)')
  })

  it('places nested comments in children outside of inner', () => {
    const wrapper = mountFull({}, {
      default: () => [h(Comment, { author: 'Li Si', content: 'Reply' })],
    })

    const root = wrapper.find('.ant-comment').element
    expect(root.querySelector(':scope > .ant-comment-children')).not.toBeNull()
    expect(root.querySelector(':scope > .ant-comment-inner > .ant-comment-children')).toBeNull()

    const nested = wrapper.find('.ant-comment-children > .ant-comment')
    expect(nested.exists()).toBe(true)
    expect(nested.find('.ant-comment-author').text()).toBe('Li Si')
  })

  it('keeps datetime inline by default and stacks it when datetimePlacement is block', async () => {
    const inline = mountFull()
    expect(inline.find('.ant-comment-header').classes()).toContain('ant-flex-justify-flex-start')
    expect(inline.find('.ant-comment-header').classes()).not.toContain('ant-flex-vertical')

    const block = mountFull({ datetimePlacement: 'block' })
    expect(block.find('.ant-comment-header').classes()).toContain('ant-flex-vertical')
    expect(block.find('.ant-comment-header').classes()).toContain('ant-flex-align-flex-start')

    await block.setProps({ datetimePlacement: 'inline' })
    await nextTick()
    expect(block.find('.ant-comment-header').classes()).not.toContain('ant-flex-vertical')
  })

  it('maps align to the logical end of the header row', () => {
    const start = mountFull({ align: 'start' })
    expect(start.find('.ant-comment-header').classes()).toContain('ant-flex-justify-flex-start')

    const end = mountFull({ align: 'end' })
    expect(end.find('.ant-comment-header').classes()).toContain('ant-flex-justify-space-between')

    const blockEnd = mountFull({ datetimePlacement: 'block', align: 'end' })
    expect(blockEnd.find('.ant-comment-header').classes()).toContain('ant-flex-align-flex-end')
  })

  it('omits header, body and actions nodes when nothing is provided', () => {
    const wrapper = mount(Comment, {})

    expect(wrapper.find('.ant-comment').exists()).toBe(true)
    expect(wrapper.find('.ant-comment-header').exists()).toBe(false)
    expect(wrapper.find('.ant-comment-body').exists()).toBe(false)
    expect(wrapper.find('.ant-comment-actions').exists()).toBe(false)
    expect(wrapper.find('.ant-comment-children').exists()).toBe(false)
  })

  it('renders a header as long as either author or datetime exists', () => {
    const wrapper = mount(Comment, { props: { datetime: 'just now' } })

    expect(wrapper.find('.ant-comment-header').exists()).toBe(true)
    // 空节点必须整体缺席，否则容器上的 column-gap 会凭空多出一份间距
    expect(wrapper.find('.ant-comment-author').exists()).toBe(false)
    expect(wrapper.find('.ant-comment-datetime').text()).toBe('just now')
  })

  it('omits the avatar wrapper when no avatar is provided', () => {
    const wrapper = mount(Comment, { props: { author: 'Zhang San' } })

    expect(wrapper.find('.ant-comment-inner').exists()).toBe(true)
    expect(wrapper.find('.ant-comment-avatar').exists()).toBe(false)
  })

  it('follows the repo-wide root style priority', () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        comment: {
          styles: {
            root: {
              backgroundColor: 'rgb(255, 0, 0)',
              marginTop: '1px',
              borderTopWidth: '1px',
            },
          },
          style: {
            backgroundColor: 'rgb(0, 0, 255)',
            marginTop: '2px',
          },
        },
      },
      slots: {
        default: () => h(Comment, {
          author: 'Zhang San',
          styles: {
            root: {
              backgroundColor: 'rgb(0, 128, 0)',
              paddingTop: '3px',
            },
          },
          style: {
            backgroundColor: 'rgb(255, 255, 0)',
          },
        }),
      },
    })

    const style = (wrapper.find('.ant-comment').element as HTMLElement).style
    expect(style.backgroundColor).toBe('rgb(255, 255, 0)')
    expect(style.marginTop).toBe('2px')
    expect(style.paddingTop).toBe('3px')
    expect(style.borderTopWidth).toBe('1px')
  })

  it('uses Comment defaults from ProConfigProvider and merges semantic configuration', async () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        comment: {
          datetimePlacement: 'block',
          align: 'end',
          classes: { root: 'provider-root' },
        },
      },
      slots: {
        default: () => h(Comment, {
          author: 'Zhang San',
          datetime: '5 minutes ago',
          classes: { root: 'props-root' },
        }),
      },
    })

    await nextTick()
    const root = wrapper.find('.ant-comment')
    expect(root.classes()).toContain('provider-root')
    expect(root.classes()).toContain('props-root')
    expect(wrapper.find('.ant-comment-header').classes()).toContain('ant-flex-vertical')
  })

  it('lets props override ProConfigProvider defaults', () => {
    const wrapper = mount(ProConfigProvider, {
      props: { comment: { datetimePlacement: 'block', align: 'end' } },
      slots: {
        default: () => h(Comment, {
          author: 'Zhang San',
          datetime: '5 minutes ago',
          datetimePlacement: 'inline',
          align: 'start',
        }),
      },
    })

    const header = wrapper.find('.ant-comment-header')
    expect(header.classes()).not.toContain('ant-flex-vertical')
    expect(header.classes()).toContain('ant-flex-justify-flex-start')
  })

  it('adds the rtl class and keeps the nested indent on a logical property', () => {
    const wrapper = mount({
      render() {
        return h(ConfigProvider, { direction: 'rtl' }, {
          default: () => h(Comment, { author: 'Zhang San', content: 'x' }, {
            default: () => h(Comment, { content: 'nested' }),
          }),
        })
      },
    })

    expect(wrapper.find('.ant-comment').classes()).toContain('ant-comment-rtl')
    expect(wrapper.find('.ant-comment-children').exists()).toBe(true)
  })

  it('merges root class and style from attrs and forwards the rest', () => {
    const wrapper = mount(Comment, {
      props: { author: 'Zhang San', rootClass: 'from-root-class' },
      attrs: {
        class: 'from-attrs',
        style: 'margin-top: 7px',
        id: 'comment-1',
        'data-extra': 'yes',
      },
    })

    const root = wrapper.find('.ant-comment')
    expect(root.classes()).toContain('from-root-class')
    expect(root.classes()).toContain('from-attrs')
    expect(root.attributes('style')).toContain('margin-top: 7px')
    expect(root.attributes('id')).toBe('comment-1')
    expect(root.attributes('data-extra')).toBe('yes')
  })

  describe('generated css', () => {
    /**
     * `content` 是 `inner` 的 flex item，默认 `flex-grow: 0` 只会占内容宽度。
     * 不显式撑满时，header 的 `align: 'end'` 只在内容宽度内生效，
     * 正文很短时 `space-between` 看不出任何效果。
     */
    it('makes the content column fill the remaining width', () => {
      mount(Comment, { props: { author: 'Zhang San', content: 'x' } })

      const css = Array.from(document.querySelectorAll('style'))
        .map(el => el.textContent ?? '')
        .join('\n')
        .replace(/\s+/g, '')

      expect(css).toContain('.ant-comment-content{flex:auto;min-width:0')
    })

    /**
     * 组件 token 到样式里是 `var(--ant-comment-*)` 字符串，`a + b` 会被拼成
     * `var(--a)var(--b)` —— 浏览器静默丢弃该声明且不报错。必须走 calc()。
     */
    it('emits the nested indent as a valid calc()', () => {
      mount(Comment, { props: { author: 'Zhang San', content: 'x' } })

      const css = Array.from(document.querySelectorAll('style'))
        .map(el => el.textContent ?? '')
        .join('\n')
        .replace(/\s+/g, '')

      expect(css).toContain(
        'padding-inline-start:calc(var(--ant-comment-avatar-size)+var(--ant-comment-content-gap))',
      )
      expect(css).not.toContain(
        'padding-inline-start:var(--ant-comment-avatar-size)var(--ant-comment-content-gap)',
      )
    })
  })
})

rtlTest(Comment)
