<template>
    <div>
        <h1>
        This is the note IndexPage
        </h1>
        
    </div>
        

</template>

<script lang="ts">

import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { Notes } from '~/../../@types/notes'

@Component({
    components: {
        // Tutorial
    },
    
    
})
export default class IndexNote extends Vue {
    @Prop({ default: '' }) query!: string
    @Prop({ default: '' }) notes!: Notes
    name: string = 'IndexNote'
    
    head() {
        return {
            title: this.name
        }
    }


    async mounted() {
        // console.log(this.query)
    }

    async fetch({query,store}) {
        console.log(store)
    }
    layout() {
        return 'dashboard'
    }
    

}
</script>

<style>

</style>