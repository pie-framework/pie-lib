extern crate rust_scripts;

use rust_scripts::*;
use std::env;
use std::process;

fn main() {
    let config = Config::new(env::args()).unwrap_or_else(|err| {
        eprintln!("Problem parsing arguments: {}", err);
        process::exit(1);
    });

    println!("config: {:?}", config.scope);
    run_dev(config);
}
