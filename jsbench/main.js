
var testBlocks = [];

const TEST_START 	= "var borisas_perf_test_start_val = performance.now();";
const TEST_END		= "return performance.now() - borisas_perf_test_start_val;";

window.onload = function () {

	createTestBlock();
};

function createTestBlock () {
	var myid = (testBlocks.length == 0 ? 0 : Number(testBlocks[testBlocks.length-1].id)+1);

	var blockstr = "<span class='button'>"+
	"<button onclick='hide(\"test"+myid+"\")'>Test"+myid+"</button>"+
	"</span>"+
	"<span class='info'><input type='text' class='testname'></input></span>"+
	"<br/>"+
	"<textarea class='code' id='test"+myid+"' style='display:none;'></textarea>"+
	"<br/><button onclick='removeTestBlock("+myid+")'>Remove</button>";

	var block = document.createElement('div');
	block.className = 'block';
	block.innerHTML = blockstr;
	block.id = myid;

	var parent = document.getElementsByClassName('blockParent')[0];

	parent.appendChild(block);

	testBlocks.push(block);
};

function removeTestBlock ( id ) {

	for ( var i in testBlocks )

		if ( testBlocks[i].id == id ) {
			testBlocks[i].parentNode.removeChild(testBlocks[i]);
			testBlocks.splice(i,1);
			return;
		}
};

function runTests () {

	if ( testBlocks.length == 0 ) {
		return;
	}

	var setup = document.getElementById('setupblock').value;
	var boilerplate = document.getElementById('boilerplate').value;

	var testFunctions = [];

	for ( var i = 0; i < testBlocks.length; i ++ ) {
		testFunctions.push(getTest(i, setup, boilerplate));
	}
};


function getTest ( id , s , b ) {

	var test = document.getElementById('test'+id).value;

	return new Function (
		s +
		TEST_START +
		b +
		test +
		TEST_END
	);
};

function hide ( id ) {

	var el = document.getElementById(id);

	if ( el.style.display != "none" )
		el.style.display = "none";
	else
		el.style.display = "";
};
