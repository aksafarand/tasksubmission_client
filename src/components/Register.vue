<template>
<loader-vue v-if="isLoading"></loader-vue>
  <div class="container">
    <div class="row">
      <div class="col-sm-9 col-md-8 col-lg-8 mx-auto">
        <div class="card border-1 shadow rounded-3 my-5">
          <div class="card-body">
            <h1 class="card-title text-center mb-5 fw-light fs-5">
               <img :src="logo" width="50" height="50">
              Register User
            </h1>
          
            <form @submit.prevent="postRegister">
              <div class="form-group">
                <small
                  class="form-text text-muted"
                  v-if="
                    v$.name.$error &&
                    v$.name.$errors[0].$message != 'Value is required'
                  "
                  >Name: {{ v$.name.$errors[0].$message }}</small
                >
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Name</span>
                  </div>
                  <input
                    type="text"
                    id="name"
                    class="form-control"
                    placeholder="Name"
                    v-model="v$.name.$model"
                  />
                </div>
              </div>

              <div class="form-group">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">



                    <label class="input-group-text"
                      >Group</label
                    >
                  </div>
                    <select
        name="taskgroup-chooser"
        id="taskgroup"
        v-model="v$.taskgroup.$model"
        class="form-select"
       
        
      >
        >
         <option value="" disabled selected>Select...</option>
        <option value="weekly">Weekly</option>
        <option value="daily">Daily</option>
        <option value="ran">Ran</option>
        <option value="operation">Operation</option>
        <option value="operation">Core</option>
        <option value="operation">IPBB</option>
        <option value="operation">Sparepart</option>
      </select>
                </div>
              </div>

              <div class="form-group">
                <div class="row">
                  <div class="col">
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1"
                          >Username</span
                        >
                      </div>
                      <!-- <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"> -->
                      <input
                        type="text"
                        id="username"
                        class="form-control"
                        placeholder="Username"
                        v-model="v$.username.$model"
                      />
                    </div>
                  </div>
                  <div class="col">
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1"
                          >Password</span
                        >
                      </div>
                      <input
                        type="password"
                        class="form-control"
                        placeholder="Password"
                        v-model="v$.password.$model"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="d-grid">
                <button
                  class="btn btn-primary btn-login text-uppercase fw-bold"
                  :disabled="v$.$invalid"
                  type="submit"
                >
                  Register
                </button>
              </div>
              <hr class="my-4" />

              <router-link to="/login">Login</router-link>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import axios, {AxiosError} from "axios";
import useValidate from "@vuelidate/core";
import { required, maxLength, alphaNum } from "@vuelidate/validators";
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import LoaderVue from './Loader.vue';
import logo from "../assets/hw_logo_2.png"

interface formRegister {
  username: string;
  name: string;
  password: any;
  taskgroup: string;
}

let isLoading = ref(false);
export default defineComponent({
    components: {
    LoaderVue,
  },
  setup() {
    const $router = useRouter();

    const formData = reactive<formRegister>({
      username: "",
      name: "",
      password: "",
      taskgroup: "",
    });

    const formRegisterValidation = {
      username: { required, maxLength: maxLength(10), alphaNum },
      name: { required, maxLength: maxLength(20) },
      password: { required, maxLength: maxLength(10), alphaNum },
      taskgroup: { required },
    };

    const v$ = useValidate(formRegisterValidation, formData);

    const postRegister = async () => {
      v$.value.$validate();
      if (!v$.value.$error) {
        isLoading.value = true;

   try {
            const res = await axios.post("http://10.13.116.20:9000/api/register", formData)
            const data = await res.data
            alert( "Hi! " + data.username + " Please Login");
            $router.push({ name: "Login" });
            isLoading.value = false;
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
      postRegister,
      formData,
      isLoading,
      logo,
    };
  },
});
</script>

<style scoped>
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
</style>
