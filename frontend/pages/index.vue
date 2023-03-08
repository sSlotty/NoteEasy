<template>
  <!-- <Tutorial/> -->
    <div>
      <div class="flex flex-col space-y-4  animated fadeIn faster pb-20   pt-5 min-w-screen    left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none">
          <section class="container px-4 mx-auto">
            <div class="sm:flex sm:items-center sm:justify-between">
                <div>
                    <div class="flex items-center gap-x-3">
                        <h2 class="text-lg font-medium text-gray-800 text-white">Easy Note</h2>
                    </div>

                </div>

                <div v-if="IsLogin" class="flex items-center mt-4 gap-x-3">
                    <nuxt-link to="customer" class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto">
                
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </nuxt-link>

                    <button @click="logout" class="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-red-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-red-600">
                        

                        <span>Logout </span>
                    </button>
                </div>
              <div v-else class="flex items-center mt-4 gap-x-3">

                    <nuxt-link to="login" class="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-green-400 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-green-600">
                        

                        <span> Login  </span>
                    </nuxt-link>
                </div>
            </div>



            <div class="flex flex-col mt-6">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div class="overflow-hidden border border-gray-200 rounded-lg border shadow-md ">
                            <table class="min-w-full divide-y divide-gray-200 ">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 ">
                                            Title
                                        </th>
                                        <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 ">View more</th>
                                    </tr>
                                </thead>
                            <TableList :data="notes.data" />
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-6 sm:flex sm:items-center sm:justify-between ">
                <div>
                    <div class="flex items-center gap-x-3">
                        <h2 class="text-lg font-medium text-gray-800 text-white">Page : {{ this.current }}</h2>
                    </div>

                </div>
                <div class="sm:flex sm:items-center sm:justify-between">
                    
                        <div class="flex items-center mt-4 gap-x-3 object-right">
                            <a v-if="this.prev >= 1" :href="`?page=${prev}&limit=${this.limit}`" class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto">
                        
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                                    </svg>

                                    <span>
                                        {{ prev }}
                                    </span>
                            </a>

                            <a :href="`?page=${next}&limit=${this.limit}`" class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto">
                                

                                <span>
                                            {{ next }}
                                        </span>

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                        </svg>
                            </a>
                        </div>
                    </div>
                 

            </div>

        </section>
        </div>
    </div>
</template>

<script lang="ts">

import { Notes } from '../@types/notes';
import { Component,Vue } from 'vue-property-decorator';


@Component({
    // components: {
    //     TableList: () => import('../components/TableList.vue')
    // }
})
export default class IndexPage extends Vue {
    [x: string]:any;


    head() {
        return {
            title: 'Easy Notes'
        }
    }
    data() {
        return {
            notes: [] as Notes[],
            limit: 10,
            page: 1,
            current: 1,
            next: 1,
            prev: this.current - 1,
            IsLogin: false
        }
    }


    async asyncData(context) {
        
        const { data } = await context.$axios.get(`/note`,
            {
                params: {
                    limit: context.query.limit || 10,
                    page: context.query.page || 1
                }
            })
        
        return {
            notes: data,
            current: data.page.current,
            next: data.page.next,
            prev: data.page.current - 1,
            IsLogin: context.$auth.loggedIn
        }
    }



    async logout() {
        await this.$auth.logout()
        this.$router.push('/login')
    }

}




</script>
