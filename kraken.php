<?php

function unauthorizedDeploy() { header("HTTP/1.0 401 Unauthorized"); exit; }

if ( !file_exists('kraken.json') ) unauthorizedDeploy();

$json = json_decode( file_get_contents('kraken.json') );

if ( !isset( $_GET['auth'] ) || !isset( $json->auth ) ) unauthorizedDeploy();

if ( $_GET['auth'] != $json->auth ) unauthorizedDeploy();

//Untracked files my break the pull
//shell_exec('git stash --include-untracked');

//shell_exec( 'git pull origin master' );

echo '<pre>';

//echo shell_exec('git push origin master 2>&1');exit;

//echo shell_exec('git commit -m \'installing wp and adding template\' . 2>&1');exit;

echo "\ngit --version\n",
	shell_exec('git --version 2>&1');

if ( !is_dir(__DIR__ . '/.git') && !empty($json->repo) ) {
	unlink(__DIR__ . '/kraken.json');
	unlink(__DIR__ . '/kraken.php');

	echo "\ngit clone " . $json->repo . "\n",
		shell_exec('git clone ' . $json->repo . ' . 2>&1');

	echo "\nOk.</pre>";
} elseif ( is_dir(__DIR__ . '/.git') ) {
	echo "\ngit pull origin master\n",
	shell_exec('git pull origin master');

	echo "\nOk.</pre>";
} else {
	echo "\nError.</pre>";
}
