
<template>

<h1>LOGOUT</h1>
      <button @click.prevent="logOut">Logout</button>
</template>


<script lang="ts">
import axios from 'axios';

export default {
    name: "logOut",
    methods: {
        logOut() {
            axios.post('http://localhost:9000/api/logout')
                .then(response => {
                    localStorage.removeItem('username');
                        this.$router.push({ name: 'Login' });
                })
        },
    },
}


</script>
