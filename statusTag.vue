<template>
  <div class="status-tag" v-if="statusText">
    <el-tag :status="status" :size="size" type="info" effect="light">
      <component v-if="prefixIcon" :is="prefixIcon" class="icon" />
      {{ statusText }}
    </el-tag>
  </div>
</template>

<script>
import Locale from "../../../mixins/locale";
import StatusAgree from "../images/svg/status-agree";
import StatusPending from "../images/svg/status-pending";
import StatusReturn from "../images/svg/status-return";
import StatusReject from "../images/svg/status-reject";

const STATUS_ICON = {
  SUBMITTED: StatusAgree,
  PASS: StatusAgree,
  REJECT: StatusReject,
  TODO: StatusPending,
  OVERRULE: StatusReturn,
  REVOKE: StatusReturn,
  WAIT: null,
};

export default {
  name: "StatusTag",
  mixins: [Locale],
  props: {
    // 标签大小
    size: {
      type: String,
      default: "medium", // small
      validator: (value) => ["small", "medium"].includes(value),
    },
    // 状态类型
    status: {
      type: String,
      default: "SUBMITTED",
    },
    // 标签文本
    label: {
      type: String,
      default: "",
    },
  },
  computed: {
    prefixIcon() {
      return STATUS_ICON[this.status] || STATUS_ICON.WAIT;
    },
    statusText() {
      return this.t("__workFlow__.statusText")[this.status] || this.label || "";
    },
  },
};
</script>

<style lang="scss" scoped>
.status-tag {
  display: inline-block;
  .el-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    border-radius: 8px;
    border: none;
    &[status="SUBMITTED"] {
      background-color: #E6F9EF;
      color: #009E42;
      svg.icon {
        fill: #009E42;
      }
    }
    &[status="PASS"] {
      background-color: #E6F9EF;
      color: #009E42;
      svg.icon {
        fill: #009E42;
      }
    }
    &[status="REJECT"] {
      background-color: #FAEBEC;
      color: #E23030;
      svg.icon {
        fill: #E23030;
      }
    }
    &[status="TODO"] {
      background-color: #ECF3FF;
      color: #0759E3;
      svg.icon {
        fill: #0759E3;
      }
    }
    &[status="OVERRULE"] {
      background-color: #FFF1D7;
      color: #E88B00;
      svg.icon {
        fill: #E88B00;
      }
    }
    &[status="REVOKE"] {
      background-color: #FAEBEC;
      color: #E23030;
      svg.icon {
        fill: #E23030;
      }
    }
    &[status="WAIT"] {
      background-color: transparent;
      color: #727880;
    }
  }
}
</style>
