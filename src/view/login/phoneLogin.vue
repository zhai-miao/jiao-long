<template>
    <div>
      <template>
        <div class="text_group">
          <div class="input_group" :class="{'is-invalid': error}">
            <!-- 输入框 -->
            <input
              :type="type"
              :placeholder="placeholder"
              :value="value"
              :name="name"
              @input="$emit('input',$event.target.value)"
            >
            <!-- 输入框后面的内容 -->
            <button v-if="btnTitle" @click="$emit('btnClick')" :disabled="disabled">{{btnTitle}}</button>
          </div>
          <!-- 验证提示 -->
          <div v-if="error" class="invalid-feedback">{{error}}</div>
        </div>
      </template>
    </div>
</template>

<script>
    export default {
        name: "phoneLogin"
    }
</script>

<style scoped>

</style>
