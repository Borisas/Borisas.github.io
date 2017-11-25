
var testBlocks = [];

const TEST_START 	= "var borisas_perf_test_start_val = performance.now();";
const TEST_END		= "return performance.now() - borisas_perf_test_start_val;";

window.onload = function () {addBlock();};

function createTestBlock () {
};



function toggledisplay (c,i) {
	var o = (function getobj () {
		var o = document.getElementsByClassName(c);
		if ( !o )
			return null;
		for ( var j = 0; j < o.length; j++ ) {
			if ( o[j].id === i ) {
				return o[j];
			}
		}
		return null;
	})();

	if ( o ) {
		var cd = o.style.display;
		o.style.display = (cd ? "" : "none");
	}
};

function addBlock(){

	var id = 0;
	if( testBlocks.length > 0 )
		id = testBlocks[testBlocks.length-1].id+1;

	var b = document.createElement('div');
	b.className = 'block';
	b.id='bt'+id;

	var title = document.createElement('div');
	title.className = 'title';
	title.onclick = function() { toggledisplay("inside", "test"+id); };

	var close = document.createElement('button');
	close.className = 'remove';
	close.onclick = function (e) { nobublecall(e, function(){removeBlock(id);})};
	close.innerHTML="X";

	var txt = document.createElement('textarea');
	txt.className = 'code';
	// txt.id = 'test'+id;
	// txt.style.display = "none";

	var ins = document.createElement('inside');
	ins.className = 'inside';
	ins.id = 'test'+id;
	ins.style.display = 'none';


	title.appendChild( document.createTextNode("Test"+id) );
	title.appendChild(close);

	ins.appendChild(txt);


	b.appendChild(title);
	b.appendChild(ins);


	testBlocks.push({ dom : b, id : id});

	document.getElementById('cb0').appendChild(b);
};
function removeBlock(id){
	for ( var i = 0; i < testBlocks.length; i++ ){
		if (testBlocks[i].id === id ) {
			testBlocks[i].dom.parentNode.removeChild(testBlocks[i].dom);
			testBlocks.splice(i,1);
			return;
		}
	}
};

function runTests() {

};

function nobuble(e){
	e.stopPropagation();
};
function nobublecall(e,call){
	e.stopPropagation();
	call();
};
