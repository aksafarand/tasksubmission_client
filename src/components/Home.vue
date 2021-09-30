<template>
<loader-vue v-if="isLoading"></loader-vue>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    
    <span class="navbar-brand">
      <img :src="logo" width="50" height="50" class="d-inline-block align-text-top ">
      </span>
    <div class="navbar-brand">Task Submission v0.1</div>
 
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">



      <!-- LEFT MENU -->
          <ul class="navbar-nav ms-auto flex-nowrap">
         
                <li class="nav-item">
                  <button class="btn btn-warning" @click.prevent="logOut">LOGOUT</button>
                </li>
            </ul>



  
    </div>
  </div>
</nav>



<div class="root">

  
<br>
<h5>Hi {{ user }}</h5>
<hr>

<div class="custwidth">
<div class="input-group">
  <button class="btn btn-secondary" @click.prevent="viewSubmit">View Submitted Task(s)</button>
 <datepicker class="form-select" v-model="pickdate.date"></datepicker>

 </div>
 <br>
<div class="input-group">



  <button class="btn btn-secondary" @click.prevent="selectTask">Add Task</button>
      <input
      class="form-select"
      type="text"
      v-model="taskSelector.taskname"
      v-on:keyup.enter="selectTask"
      @click="clearInput"
      list="taskList"
      placeholder="Select task from list or choose OTHER if not provided in the list"
      style="margin-right:10px;padding-right:10px;max-width:600px"
    />
  
      <datalist id="taskList">
      <option v-for="task in taskSelector.tasksList" :key="task">
        {{ task.taskname }}
      </option>
      <option>{{ custom }}</option>
    </datalist>

</div>

</div>

  
  <teleport to="body">
  <div class="modal" v-if="isView">

      <div>
  <div v-if="vDataSubmit.submittedData.length == 0">
     <h3>No Data Found</h3>
    </div>       
 
  <div v-if="isView && vDataSubmit.submittedData.length > 0">
    <h3>Submitted Tasks</h3>
    <div class="scroll">
  <table class="table table-bordered">
    <thead class="tablehead">
      <tr>
        <th scope="row">Date</th>
           <th scope="row">TaskName</th>
        <th scope="row">Remark</th>
     
      </tr>
    </thead>
    <tbody class="tablebody">

      <tr v-for="(task) in vDataSubmit.submittedData" :key="task.date">
        <td>{{ task.date }}</td>
         <td>{{ task.taskname }}</td>
        <td>{{ task.remark }}</td>
       
     
       
      </tr>
    </tbody>
  </table>
</div>
</div>
          <button  type="button" class="btn btn-outline-secondary" @click="isView = false">Close</button>
      </div>
  </div>
  </teleport>

  
  <br>

   
  <div v-if="isFill" class="tablemax">
    
    <div class="scroll">
  <table class="table  table-bordered  table-hover ">
    <thead class="tablehead table-secondary">
      <tr>
        <th scope="row">TaskName</th>
        <th scope="row">Remark</th>
        <th scope="row">Remove</th>
      </tr>
    </thead>
    <tbody class="tablebody">
      <tr v-for="(task, index) in taskSelector.selectedTask" :key="task">
        <td v-if="task">{{ task }}</td>
        <td>
          <input
            type="text"
            class="widthrem"
            v-model="submitedTask.submitRequest[index].remark"
          />
        </td>
        <td>
          <button class="btn btn-outline-danger btn-sm widthrem" @click.prevent="removeItem(index, task)">Remove</button>
        
        </td>
      </tr>
    </tbody>
   
  </table>



    <table class="table">
    <thead class="tablehead">
      <tr>
        <th scope="row"></th>
        
      </tr>
    </thead>
    <tbody class="tablebody">
      <tr>
      
        <td  class="table-dark">
          <button class="btn btn-success btn-md widthrem" @click.prevent="submitTask">Submit Task(s)</button>

        </td>
      </tr>
    </tbody>
   
  </table>
  
  </div>
 

</div>


  


</div>

</template>

<script lang="ts">
import axios, {AxiosError} from "axios";
import Datepicker from 'vue3-datepicker';
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import format from 'date-fns/format'
import logo from "../assets/hw_logo_2.png"
import LoaderVue from './Loader.vue';


interface selectTask {
  taskname: string;
  selectedTask: any;
  tasksList: any;
}


interface viewSubmitTask {
  submittedData: any,
}


interface submitTask {
  submitRequest: any;
}

interface pickdate {
  date: any;
}

const isView = ref(false);
let isFill = ref(false);
let isLoading = ref(false);
let custom = ref('OTHER:');
export default defineComponent({
    components: {
        Datepicker,
        LoaderVue,
    },
    setup() {
    const $router = useRouter();

    const taskSelector = reactive<selectTask>({
      taskname: "",
      selectedTask: new Set(),
      tasksList: [],
    });

    



    // let pickdate:any;
    // let pickdate = new Date()
    let pickdate = reactive<pickdate>({
      date: new Date()
    });
    
    const submitedTask = reactive<submitTask>({
      submitRequest: [],
    });

    const vDataSubmit = reactive<viewSubmitTask>({
      submittedData: [],
    });

    const getTasks = async () => {

   try {
            const res = await axios.get("http://10.13.116.20:9000/api/tasks")
            const data = await res.data
            taskSelector.tasksList = data;
            isFill.value = false
          } 
          catch(error:any) {
            let err: AxiosError = error;
            const errData = err.response
            alert(errData?.data.message);
            $router.push({ name: "Login" });
          }
    };

    const logOut = function () {
      axios.post("http://10.13.116.20:9000/api/logout").then((response) => {
        localStorage.removeItem("username");
        localStorage.removeItem("taskgroup");
        $router.push({ name: "Login" });
      });
    };

    const selectTask = () => {

      let isInTask = taskSelector.tasksList.find(tl => tl.taskname === taskSelector.taskname);
 
      if (isInTask === undefined && !taskSelector.taskname.includes(custom.value)) {
        alert('You can only create OTHER or select task from list')
        return
      }

     if (taskSelector.taskname === custom.value) {
        alert('OTHER should not be followed by your task, i.e: OTHER:[taskname]');
        return
     } 
     
     if (
        taskSelector.taskname !== ""  &&
        !taskSelector.selectedTask.has(taskSelector.taskname)
      )  {
        taskSelector.selectedTask.add(taskSelector.taskname);

        submitedTask.submitRequest.push({
          taskname: taskSelector.taskname,
          remark: "",
        });
      }

      if(taskSelector.selectedTask.size !== 0) {
        isFill.value = true
      }
    };

    const clearInput = () => {
      taskSelector.taskname = "";
    };

    const removeItem = (index: any, task: string) => {
      taskSelector.selectedTask.delete(task);
      submitedTask.submitRequest.splice(index, 1);

      
      if(taskSelector.selectedTask.size === 0) {
        isFill.value = false
      }
    };


    const viewSubmit = async () => {
       isView.value = false;
      let submitDate = format(pickdate.date,"yyyyMMdd")
      isLoading.value = true;
      try {
        const res = await axios.get("http://10.13.116.20:9000/api/submitted/"+submitDate)
        const data = await res.data
       vDataSubmit.submittedData = data;
       console.log(vDataSubmit.submittedData.length)
        isLoading.value = false;
        isView.value = true;

      }catch(error:any) {
            let err: AxiosError = error;
            const errData = err.response
            alert(errData?.data.message);
             isLoading.value = false;
          }
    };

    const submitTask = async () => {
      if (
        submitedTask.submitRequest === undefined ||
        submitedTask.submitRequest.length == 0
      ) {
        alert("Task Cannot Be Empty!");
      } else {
 isLoading.value = true;
   try {
            const res = await axios.post("http://10.13.116.20:9000/api/submit", submitedTask.submitRequest)
            const data = await res.data
             alert(data.message);
              $router.push({ name: "Home" });
            taskSelector.taskname = "";
            taskSelector.selectedTask = new Set();
            submitedTask.submitRequest = [];
            isFill.value = false;
             isLoading.value = false;
          } 
          catch(error:any) {
            let err: AxiosError = error;
            const errData = err.response
            alert(errData?.data.message);
             isLoading.value = false;
          }

      }
    };



    return {
      taskSelector,
      getTasks,
      logOut,
      selectTask,
      clearInput,
      removeItem,
      submitTask,
      submitedTask,
      user: localStorage.getItem("username"),
      isView,
      pickdate,
      Datepicker,
      logo,
      isFill,
      isLoading,
      viewSubmit,
      vDataSubmit,
      custom,
    };
  },
  created() {
    this.getTasks();
  },
});
</script>

<style scoped>

div.scroll {
  /* background-color: #fed9ff; */
  max-width: 100%;
  width:1024px;
  height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
  text-align: center;
  /* padding: 20px; */
}
.tablebody{
  vertical-align: middle;
  text-align: left;
}

.tablehead {
 text-align: center;
}
.v-divider{
 margin-left:5px;
 margin-right:5px;
 width:1px;
 height:100%;
 border-left:1px solid gray;
}

.tablemax {
  max-width: 90%;
font-size: 0.9em;
}
.widthrem {
  width: 100%;
}
.root {
    position: relative;
    padding-left: 10px;
    padding-right: 10px;
}

.modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color:rgba(46, 46, 46, 0.315);
    
}

.custwidth {
  width: 70%;
}

.modal > div {
    background-color: rgb(255, 255, 255);
    padding: 1%;
    /* border-radius: 10px; */
      font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;

}
</style>
