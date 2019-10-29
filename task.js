let phones = JSON.parse(localStorage.getItem('phones'))

if(localStorage.getItem('phones') == undefined || phones.length ==0 ) localStorage.setItem('phones',JSON.stringify([['Smartphones',true,[],false]]))

function searchInArray(array,value,path = [],count=-1){
			count++
			for( index in array){
				path[count] = array[index][0]
				if(array[index][0] == value){
					return path
				}
				else if(array[index][2].length != 0){
					let search = searchInArray(array[index][2],value,path,count)
				
					if(search != undefined) return search	
				}
				path.splice(index,1) 
			}
			return undefined
}

Vue.component('tree',{
	props:['phones'],
	template:` 
	<div id="phones">
		<input type="text" placeholder="Search" @input="search($event)"/>
		<p id="result">{{result}}</p>
		<branch :branches="phones" :phones="phones"></branch>
	</div>
	`,
	methods:{
		search(event){
			let value = event.target.value
			let array = this.phones
			
			if(value.length == 0) return this.result = ''
			if(array[0][2].length == 0) return false


			let result = searchInArray(array[0][2],value)
			if(!result) this.result = 'not found'
				else this.result = `${result.join(' > ')}`
		},
	},
	data:()=>{
		return {
			result:''
		}
	}
})

Vue.component('branch',{
	props:['branches','phones'],
	template:` 
		<ul>
			<template v-for="(branch,index) in branches">
				<li>
					<p class="note" @click="showChild(branch,phones)">{{branch[0]}}</p>
					<p class="plus" @click="showModalInput(branch,phones)"><b>+</b></p>
					<p class="minus" @click="deleteItem(branches,index,phones)"><b>-</b></p>
					<input type="text" class="modalInput" v-show="branch[3]" @keyup.enter="addPhone(branch,$event,phones)"/><!--show modal input-->
				</li>
				<li v-if="branch[1] && branch[2].length">
					<branch :branches="branch[2]" :phones="phones"></branch>
				</li>
			</template>
		</ul>
	`,
	methods:{
		deleteItem(array,index,phones){
			array.splice(index,1)
			localStorage.setItem('phones',JSON.stringify(phones))
		},
		showModalInput(branch){
			Vue.set(branch,3,!branch[3])
			localStorage.setItem('phones',JSON.stringify(phones))
		},
		addPhone:function(branch,event,phones) {
			console.log(branch)
			//get new element
			let value = event.target.value
			//clear event
			event.target.value = null
			//hide modal input
			Vue.set(branch,3,!branch[3])
			//add new element in the tree
			branch[2].push([value,false,[],false])
			localStorage.setItem('phones',JSON.stringify(phones))

		},
		showChild(branch,phones){
			Vue.set(branch,1,!branch[1])
			localStorage.setItem('phones',JSON.stringify(phones))
		}
	}

})

new Vue({
	el:'#app',
	data:{
		phones: JSON.parse(localStorage.getItem('phones')),
	}
})