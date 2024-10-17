<template>
  <div>
    <select v-model="lineSelected" @change="makeApiRequest">
      <option v-for="line in lines" :key="line" :value="line">{{ `Line ${line}` }}</option>
    </select>
    <h2>Active vehicles on Line :{{ lineSelected }}</h2>
    <table v-if="response.length > 0">
      <thead>
        <tr>
          <th style="background-color: #dedede;" v-for="(key, index) in Object.keys(response[0])" :key="index">{{ key }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(vehicle, index) in response" :key="index">
          <td style="border-bottom:1px solid grey; height: 60px;" v-for="(value, key) in vehicle" :key="key">{{ value }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No active vehicles found.</p>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      accessToken: '',
      response: '',
      lines: [1, 2, 3, 4, 5, 6],
      lineSelected: 1,
      networkId: '',
      intervalId: null // add this line
    }
  },
  created() {
    console.log('Created!');
    this.getAccessToken()
    this.intervalId = setInterval(() => {
      this.makeApiRequest()
    }, 30000) // 30000 milliseconds = 30 seconds
  },
  beforeDestroy() {
    clearInterval(this.intervalId)
  },
  
  methods: {
    getAccessToken() {
      console.log('Getting access token...');
      axios.get('localhost:3000/connect/token')
        .then(response => {
          console.log('Access token response:', response.data.accessToken);
          this.accessToken = response.data.accessToken
          this.makeApiRequest()
        })
        .catch(error => {
          console.error(error)
          console.log("That went wrong");
        })
    },
    makeApiRequest() {
  
  
  const headers = {
    'Authorization': `Bearer ${this.accessToken} 'Content-Type': 'application/x-www-form-urlencoded'`
  };
  axios.get('localhost:3000/api/v1/activevehicles', {
    headers: headers, // Pass headers as a separate option
    params: {
      networkId: this.lineSelected > 3 ? 2 : 1,
      lineId: this.lineSelected,
    }
      })
      .then(response => {
        const data = response.data;
        this.response = data; // Assign to response instead of parsedResponse
      })
      .catch(error => {
        console.error(error);
        this.response = 'Error: ' + error.message;
      });
    }
  }
}


</script>
