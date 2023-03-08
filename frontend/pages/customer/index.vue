<template>
  <div class="bg-blue-300">

   
  </div>
</template>

<script>

import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    
    },
    layout: 'default',
    middleware: ['auth']

})
export default class Customer extends Vue {

    head() {
        return {
        title: 'Customer Page'
        }

    }
    layout(context) {
        return 'dashboard'
    }

}
</script>

<style>

</style>