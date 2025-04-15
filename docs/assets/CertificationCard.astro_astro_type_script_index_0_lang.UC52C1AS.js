typeof window<"u"&&document.addEventListener("keydown",function(n){n.key==="Escape"&&document.querySelectorAll("dialog[open]").forEach(e=>{e instanceof HTMLDialogElement&&e.close()})});
