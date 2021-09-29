<template>
<loader-vue v-if="isLoading"></loader-vue>
  <div class="container">
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card border-1 shadow rounded-3 my-5">
          <div class="card-body">
            <h1 class="card-title text-center mb-5 fw-light fs-5">
              <img :src="logo" width="50" height="50">
              Task Submission v0.1
            </h1>
            <hr />
            <form @submit.prevent="postLogin">
              <div class="form-floating mb-3">
                <input
                  type="text"
                  class="form-control"
                  id="floatingInput"
                  placeholder="Username"
                  v-model="v$.username.$model"
                  required
                />

                <label
                  v-if="
                    v$.username.$error &&
                    v$.username.$errors[0].$message != 'Value is required'
                  "
                  for="floatingInput"
                  >Username: {{ v$.username.$errors[0].$message }}</label
                >
                <label v-else for="floatingInput">Username</label>
              </div>

              <div class="form-floating mb-3">
                <input
                  type="password"
                  class="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  v-model="v$.password.$model"
                />
                <label
                  v-if="
                    v$.password.$error &&
                    v$.password.$errors[0].$message != 'Value is required'
                  "
                  for="floatingInput"
                  >Password: {{ v$.username.$errors[0].$message }}</label
                >
                <label v-else for="floatingInput">Password</label>
              </div>

              <div class="d-grid">
                <button
                  class="btn btn-primary btn-login text-uppercase fw-bold"
                  :disabled="v$.$invalid"
                  type="submit"
                >
                  Sign in
                </button>
              </div>
              <hr class="my-4" />
    
                <router-link to="/register">Register</router-link>
              
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { required, maxLength, alphaNum } from "@vuelidate/validators";
import { useRouter } from "vue-router";
import useValidate from "@vuelidate/core";
import axios, { AxiosError} from "axios";
import { defineComponent, reactive, ref } from "vue";
import LoaderVue from './Loader.vue';
import logo from "../assets/hw_logo_2.png"


axios.defaults.withCredentials = true;

interface formLogin {
  username: string;
  password: string;
}

let isLoading = ref(false);
export default defineComponent({
  components: {
    LoaderVue,
  },
  setup() {
    const $router = useRouter();

    const formData = reactive<formLogin>({
      username: "",
      password: "",
    });

    const formLoginValidation = {
      username: { required, maxLength: maxLength(10), alphaNum },
      password: { required, maxLength: maxLength(10), alphaNum },
    };

    const v$ = useValidate(formLoginValidation, formData);

    const postLogin = async () => {
   
      v$.value.$validate();
      console.log(v$.value);
      if (!v$.value.$error) {
          isLoading.value = true;
         
          try {
            const res = await axios.post("http://10.13.116.20:9000/api/login", formData)
            const data = await res.data
            localStorage.setItem("username", data.username);
            localStorage.setItem("taskgroup", data.taskgroup);
            isLoading.value = false;
            $router.push({ name: "Home" });
          } 
          catch(error:any) {
            let err: AxiosError = error;
            const errData = err.response
            alert(errData?.data.message);
            isLoading.value = false
          }
         
      }

    };

    return {
      v$,
      postLogin,
      formData,
      isLoading,
      logo,
    };
  },
});
</script>

<style scoped>
body {
  background: #007bff;
  background: linear-gradient(to right, #0062e6, #33aeff);
  font-size: 0.8em;
}

.card {
  top: 10%;
}
.card-body {
  margin-top: 30px;
}
.btn-login {
  font-size: 0.9rem;
  letter-spacing: 0.05rem;
  padding: 0.75rem 1rem;
}

.btn-register {
  color: white !important;
  background-color: #ea4335;
}

.error-label {
  font-size: 0.9rem;
}
</style>
