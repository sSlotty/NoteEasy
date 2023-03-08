<template>
    
        <div class="">
            <div class="min-h-screen py-6 flex flex-col justify-center sm:py-12 ">
            <div class="relative py-3 sm:max-w-xl sm:mx-auto">
                <div
                    class="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                </div>
                <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div class="max-w-md mx-auto">
                        <div>
                            <h1 class="text-2xl font-semibold">Login To Easy Note Manager</h1>
                        </div>
                        <div class="divide-y divide-gray-200">
                            <form @submit="onSubmit">
                                <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div class="relative ">
                                    <input v-model="username" autocomplete="off" id="username" type="text" class="rounded-md p-2 peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Username" />
                                    <label for="username" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Username</label>
                                </div>
                                <div class="relative">
                                    <input v-model="password" autocomplete="off" id="password" type="password" class="rounded-md p-2 peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" />
                                    <label for="password" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
                                </div>
                                <div class="relative">
                                    <button class="bg-blue-500 text-white rounded-md px-2 py-1" type="submit">Submit</button>
                                </div>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
</template>

<script lang="ts">

import { Component, Vue,Prop } from 'nuxt-property-decorator'
import Swal from 'sweetalert2'




@Component({
    components: {
        
    }
})
export default class Login extends Vue {
    [x: string]: any

    username: string = ''
    password: string = ''
    name: string = 'Login Page'

    
    head() {
        return {
            title: this.name
        }
    }

    mounted() {
        console.log('mounted')
    }

    beforeMount() {
        document.getElementById('username')?.focus()
       console.log( )
    }

    async onSubmit(e: Event) {
        e.preventDefault()

        if (this.username === '' || this.password === '') {
            alert('Please fill all the fields', 'error')
        }
        
        const payload = {
            username: this.username,
            password: this.password
        }
        await this.login(payload)

    }
    async login(payload: { username: string, password: string }) {
        const endcode: string = btoa(`${payload.username}:${payload.password}`)
        const config = {
            headers: {
                'Authorization': 'Basic '+ endcode,
            },
            data: payload
        }
        // this.$axios.post('/login', payload, config)
        try {
            this.$auth.loginWith('local', config)
            .then((res) => {
                alert('Login Success', 'success')
            }).catch((err) => {
                console.log(err)
                alert('Login Failed', 'error')
            })
        } catch (error) {
            console.log(error)
        }
        
            
    }
    
}

const alert = (title, icon) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: icon,
        title: title
    })
}

    


</script>

<style>

</style>