<script>
	import Template from "$lib/Template.svelte";
    import { Template as CodeTemplate } from "df.ts";

</script>
<h1>template demo</h1>
<p>Example page of template</p>

<Template template={CodeTemplate.parse({"blocks":[{"id":"block","block":"event","args":{"items":[{slot:3,item:{id:"loc",data:{isBlock:false,loc:{x:1,y:2,z:3,pitch:90,yaw:-20}}}},{slot:3,item:{id:"loc",data:{isBlock:false,loc:{x:1,y:2,z:3,pitch:90,yaw:-20}}}},{slot:3,item:{id:"loc",data:{isBlock:false,loc:{x:1,y:2,z:3,pitch:90,yaw:-20}}}}]},"action":"honestly","target":"quite","inverted":"incredible"}]})} />