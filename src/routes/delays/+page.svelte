
<script>
	export let data;
    const { delays } = data;
    export let plantKeys = Array.from(new Set(delays.map(d => d.PlantKey)));
console.log(data)
</script>

<h1>delays</h1>

<ul>
	{#each plantKeys as plant}
		<li><a href="/delays/{plant}">Distribution Plant:{plant}</a></li>
	{/each}
</ul>

 