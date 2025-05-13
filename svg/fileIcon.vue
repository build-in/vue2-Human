<template>
  <main class="container">
    <section class="icon-wrapper">
      <div class="icon-container">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.625 5C5.7676 5 4.25 6.52333 4.25 8.375C4.25 9.1887 4.54304 9.93588 5.02916 10.5205C5.294 10.8389 5.25052 11.3118 4.93204 11.5767C4.61356 11.8415 4.14068 11.798 3.87583 11.4795C3.17696 10.6391 2.75 9.5563 2.75 8.375C2.75 5.69667 4.9374 3.5 7.625 3.5H11.375C14.0542 3.5 16.25 5.69579 16.25 8.375C16.25 11.0533 14.0626 13.25 11.375 13.25H9.5C9.08579 13.25 8.75 12.9142 8.75 12.5C8.75 12.0858 9.08579 11.75 9.5 11.75H11.375C13.2324 11.75 14.75 10.2267 14.75 8.375C14.75 6.52421 13.2258 5 11.375 5H7.625Z" fill="#9DA2A7"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.625 10.25C8.7676 10.25 7.25 11.7733 7.25 13.625C7.25 15.4758 8.77421 17 10.625 17H14.375C16.2324 17 17.75 15.4767 17.75 13.625C17.75 12.8113 17.457 12.0641 16.9708 11.4795C16.706 11.1611 16.7495 10.6882 17.068 10.4233C17.3864 10.1585 17.8593 10.202 18.1242 10.5205C18.823 11.3609 19.25 12.4437 19.25 13.625C19.25 16.3033 17.0626 18.5 14.375 18.5H10.625C7.94579 18.5 5.75 16.3042 5.75 13.625C5.75 10.9467 7.9374 8.75 10.625 8.75H12.5C12.9142 8.75 13.25 9.08579 13.25 9.5C13.25 9.91421 12.9142 10.25 12.5 10.25H10.625Z" fill="#9DA2A7"/>
        </svg>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'FileIcon'
}
</script>

  <style lang="scss" scoped>
  .icon-wrapper {
    width: 18px;
    height: 18px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .circle-icon {
    border-radius: 50%;
  }

  @media (max-width: 991px) {
    .icon-wrapper {
      width: 16px;
      height: 16px;
    }
  }

  @media (max-width: 640px) {
    .icon-wrapper {
      width: 14px;
      height: 14px;
    }
  }
  </style>
