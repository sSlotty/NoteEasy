<template>
    <tbody v-if="tableData" class="bg-white divide-y divide-gray-200">

        <tr v-for="note in tableData" :key="note.noteID">
        
            <td class="px-12 py-4 text-sm font-medium whitespace-nowrap">
                {{ note.title }}
            </td>



            <td class="px-4 py-4 text-sm whitespace-nowrap">
                 <nuxt-link :to="`/notes/${note.noteID}`" >
                    <button class="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600">
            

                        <span>View more</span>
                    </button>
                 </nuxt-link>
            </td>
        </tr>

    </tbody>
</template>
<script lang="ts">
import Vue from 'vue';
import { Note } from '../@types';
export default Vue.extend({
    name: 'TableList',
    props: {
        data: {
            type: Array,
            required: true,
        },
    },
    data()
    {
        return {
            tableData: this.data,
        };
    },

}); 



</script>


<!-- Path: frontend/components/TableList.vue -->
