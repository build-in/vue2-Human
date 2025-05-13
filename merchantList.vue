<template>
  <div class="item-work-div">
    <div v-for="item in list" :key="item.id" class="div-2" @click="choose(item)">
      <div class="div-3">
        <img :src="item.url" class="avatar-img">
      </div>
      <div class="div-4">
        <div class="div-5">{{ item.fullName }}</div>
        <div class="div-6">{{ item.email }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MerchantList',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {
    choose(item) {
      this.$emit('chooseMerchant', item)
    }
  }
}
</script>
<style lang="scss">
.item-work-div {
  display: flex;
  max-height: 400px;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: scroll;

  @media (max-width: 991px) {
    .div {
      width: 100%;
      max-width: 219px;
    }
  }

  @media (max-width: 640px) {
    .div {
      width: 100%;
      max-width: none;
      border-radius: 8px;
    }
  }

  .div-2 {
    display: flex;
    min-height: 40px;
    padding: 8px;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 10px;
  }

  .div-2:hover {
    background-color: #EAEAEA;
  }

  @media (max-width: 640px) {
    .div-2 {
      padding: 6px;
    }
  }

  .div-3 {
    display: flex;
    width: 32px;
    height: 32px;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .avatar-img {
    width: 32px;
    height: 32px;
    border-radius: 60px;
    object-fit: cover;
  }

  .div-4 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    flex: 1;
  }

  .div-5 {
    color: #1b1d1f;
    font: 400 14px/21px Poppins, sans-serif;
  }

  .div-6 {
    color: #727880;
    font: 400 12px/18px Poppins, sans-serif;
    width: 150px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
