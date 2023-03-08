<template>
  <div class="min-h-screen py-6 flex flex-col justify-center sm:py-12">
    <div class=" p-10 flex items-center justify-center">
      <div class="bg-white  border-gray-200  p-4 rounded-xl border max-w-xl">
        <div class="flex justify-between">
          <div class="flex items-center">
            <img class="h-11 w-11 rounded-full" src="https://pbs.twimg.com/profile_images/1287562748562309122/4RLk5A_U_x96.jpg"/>
            <div class="ml-1.5 text-sm leading-tight">
              <span class="text-black  font-bold block ">{{ customer.fullName }}</span>
              <span class="text-gray-500 0 font-normal block">@{{ customer.userName }}</span>
            </div>
          </div>
          <svg class="text-blue-400  h-6 w-auto inline-block fill-current" viewBox="0 0 24 24"><g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g></svg>
        </div>
        <p class="text-black  block text-xl leading-snug mt-3">{{ note.title }}</p>
        <!-- <div class="border-gray-200 d border border-b-0 my-1"></div> -->
        <p class="text-black  block text-xl leading-snug mt-3">{{ note.body }}</p>
        
        <!-- <img class="mt-2 rounded-2xl border border-gray-100 " src="https://pbs.twimg.com/media/EpkuplDXEAEjbFc?format=jpg&name=medium"/> -->
        <p class="text-gray-500  text-base py-1 my-0.5">{{ note.createdAt}}</p>
        
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Customer, Note, User } from '../../@types';
import moment from 'moment-timezone';

@Component({
  components: {
    
  }
})
export default class NoteDetail extends Vue {
  [x: string]: any
  title: string = 'Note Detail : ' + this.$route.params.id
  head() {
    return {
      title: this.title
    }
  }

  data () {
    return {
      note: {} as Note,
      customer: {} as User
    }
  }

  async asyncData(context) {
    const { data } = await context.$axios.get(`/note/${context.params.id}`)
    const { data:user } = await context.$axios.get(`/customer/${data.data[0].customerId}`)
    const utcTime = moment(data.data[0].createdAt).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
    data.data[0].createdAt = utcTime
    
    return {
      note: data.data[0],
      customer: user.user
      
    }
  }
}
</script>

<style>

</style>