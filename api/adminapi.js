import axios from "axios";

export default axios.create({
	//baseURL:"https://fakestoreapi.com",
	baseURL:'https://erceyecare.onehash.ai/api/resource',
      headers: {
            'Accept-Encoding': 'compress',
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
             }
})
