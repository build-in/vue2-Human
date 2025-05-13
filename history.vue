<template>
  <div class="workflow-card workflow-history">
    <div class="module-title">{{ t('__workFlow__.module.history') }}</div>
    <div class="step">
      <div v-for="(v, i) in historyData" :key="i" class="item">
        <div class="left-icon">
          <div
            class="line"
            :class="{'wait-line': historyData[i+1] && getVal(historyData[i+1])}"
          />
          <div class="head-icon" :class="{'other-grid': getVal(v)}">
            <img class="users" src="../images/users.png">
            <div v-if="icons[v.activityStatus]" class="icon">
              <img :src="icons[v.activityStatus]">
            </div>
          </div>
        </div>
        <div class="desc">
          <div class="step-title">
            <div :class="v.activityStatus">{{ v.activityName || t('__workFlow__.approver') }}（<span>{{ betterDisplay(t('__workFlow__.statusText')[v.activityStatus]) }}</span>）</div>
          </div>
          <div class="step-desc">
            <div class="approval-time">
              <span>{{ formattedDateTime(v.startTime) }}</span>
              <span v-if="v.endTime"> ~ {{ formattedDateTime(v.endTime) }}</span>
            </div>
            <div class="approver">
              <div v-for="(x, y) in v.taskDTOList" :key="y" class="approver-group">
                <div v-for="(item, index) in x.userDTOList" :key="index" class="approver-item">
                  <div class="img-group">
                    <div class="img">
                      <span>{{ item.name | avatar }}</span>
                      <img v-if="item.avatar" class="avatar" :src="item.avatar">
                      <div v-if="icons[x.taskStatus]" class="icon">
                        <img :src="icons[x.taskStatus]">
                      </div>
                    </div>
                  </div>
                  <div class="name">{{ item.name }}</div>
                </div>
              </div>
            </div>
            <div class="approver-comment">
              <div v-for="(x,y) in v.taskDTOList" :key="y">
                <div v-for="(item, index) in x.comments" :key="`comment-${index}`" class="item-comment">
                  <div>{{ item.fullMessage }}</div>
                </div>
                <div v-for="(item, index) in x.attachments" :key="`att-${index}`" class="item-comment">
                  <div>
                    <a :href="item.url" target="_blank">{{ t('__workFlow__.viewAttachment') }}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Locale from '../../../mixins/locale'
import { betterDisplay } from '../utils/string.js'
import iconTodo from '../images/tick-todo.png'
import iconPass from '../images/tick-pass.png'
import iconReject from '../images/tick-reject.png'
import iconRevoke from '../images/tick-revoke.png'
const icons = {
  'TODO': iconTodo,
  'PASS': iconPass,
  'REJECT': iconReject,
  'REVOKE': iconRevoke,
  'OVERRULE': iconReject
}
export default {
  name: 'History',
  filters: {
    avatar(val) {
      // 名字不存在
      if (!val) return ''
      if (/^[\u4e00-\u9fa5]+$/.test(val)) {
      // 中文名字
        return val.slice(-2)
      } else {
        // 英文名字
        const words = val.split(' ')
        if (words.length === 1) {
          const name = words[0] || ''
          const nameResult = name.slice(0, 2) || ''
          return nameResult.toUpperCase()
        }
        if (words.length >= 2) {
          const nameFirst = words[0][0] || ''
          const nameLast = words[1][0] || ''
          return (nameFirst.toUpperCase() + nameLast.toUpperCase())
        }
      }
    }
  },
  mixins: [Locale],
  props: {
    historyData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      icons
    }
  },
  methods: {
    betterDisplay,
    formattedDateTime(date) {
      if (!date) {
        return ''
      }
      const dateTime = new Date(date)
      const year = dateTime.getFullYear()
      const month = ('0' + (dateTime.getMonth() + 1)).slice(-2)
      const day = ('0' + dateTime.getDate()).slice(-2)
      const hour = ('0' + dateTime.getHours()).slice(-2)
      const minute = ('0' + dateTime.getMinutes()).slice(-2)
      const second = ('0' + dateTime.getSeconds()).slice(-2)
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    // 获取数据的状态
    getVal(obj) {
      if (obj && obj.activityStatus === 'WAIT') {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.workflow-history {
  .step {
    .item {
      display: flex;
      &:last-child {
          .line {
            display: none;
          }
        }
      // padding-bottom: 30px;
      .left-icon {
        width: 40px;
        position: relative;
      }
      .wait-line {
        border-left: 2px dashed #DDDDDD !important;
      }
      .line {
        border-left: 2px solid #DDDDDD;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 19px;
      }
      .other-grid {
        background: #9DA2A7 !important;
      }
      .head-icon {
        width: 40px;
        height: 40px;
        background: #3782FF;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 14px;
        flex: 0 0 40px;
        position: relative;
        z-index: 2;
        .users {
          width: 24px;
        }
        .icon {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 16px;
          height: 16px;
          background: #fff;
          border-radius: 100%;
          & > img {
            width: 100%;
          }
        }
      }
      .desc {
        margin-left: 12px;
        width: 100%;
        font-size: 14px;
        margin-bottom: 30px;
        .step-title {
          // display: flex;
          // justify-content: space-between;
          // & > div {
          //   &:last-child {
          //     color: #9DA2A7;
          //     flex: 0 0 150px;
          //     text-align: right;
          //   }
          // }
          .PASS span {
            color: #00C352;
          }
          .TODO span {
            color: #FB9701;
          }
          .REJECT span,.OVERRULE span {
            color: #F44444;
          }
          .WAIT {
            color: #727880;
          }
        }
        .step-desc {
          .approval-time {
            color: #9DA2A7;
            font-size: 14px;
          }
          // .approval-status {
          //   font-size: 14px;
          //   color: #9DA2A7;
          //   display: flex;
          //   justify-content: space-between;
          //   .time {
          //     flex: 0 0 150px;
          //     text-align: right;
          //   }
          // }
          .approver-group {
            display: flex;
            flex-wrap: wrap;
          }
          .approver-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 12px;
            margin-top: 12px;
            width: 48px;
            .img-group {
              text-align: center;
              .img-wait {
                background: #9DA2A7;
              }
              .img {
                width: 24px;
                height: 24px;
                border-radius: 100%;
                background: #3782FF;
                color: #fff;
                font-size: 9px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                .avatar {
                  position: absolute;
                  width: 24px;
                  height: 24px;
                  border-radius: 100%;
                  position: absolute;
                  top: 0;
                }
                .icon {
                  position: absolute;
                  width: 12px;
                  height: 12px;
                  bottom: 0;
                  right: 0;
                  background: #fff;
                  border-radius: 100%;
                  & > img {
                    width: 100%;
                  }
                }
              }
            }
            .name {
              font-size: 12px;
              margin-top: 4px;
              color: #9DA2A7;
              word-break: break-all;
              text-align: center;
            }
          }
          .approver-comment {
            background: #F8F8F8;
            border-radius: 4px;
            box-sizing: border-box;
            padding: 0 8px;
            font-size: 12px;
            color: #727880;
            margin-top: 8px;
            overflow: hidden;
            .item-comment {
              word-break: break-all;
              &:first-child {
                margin-top: 6px;
              }
              &:last-child {
                margin-bottom: 6px;
              }
              a {
                color: #3782FF;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
