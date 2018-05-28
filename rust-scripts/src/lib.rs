use std::fs;
use std::process::{Command, Output};

pub struct Config {
  pub scope: Option<String>,
}

impl Config {
  pub fn new(mut args: std::env::Args) -> Result<Config, &'static str> {
    args.next();

    let scope = args.next();
    Ok(Config { scope })
  }
}

/**
 * Add package names to p
 */
fn read_package_names(p: &mut Vec<String>) {
  match fs::read_dir("../packages") {
    Ok(rd) => {
      for entry in rd {
        match entry {
          Ok(de) => {
            p.push(de.file_name().into_string().unwrap_or_default());
          }
          Err(_) => (),
        }
      }
    }
    Err(_) => (),
  }
}

pub fn run_dev(config: Config) {
  println!("run config...");
  println!("list dirs in packages");
  let mut packages: Vec<String> = Vec::new();
  match config.scope {
    Some(s) => packages.push(s),
    None => read_package_names(&mut packages),
  };

  println!("> packages {:?}", packages);
  let processes: Vec<Output> = packages
    .iter()
    .map(|p| {
      Command::new("sh")
        .arg("-c")
        .arg("echo p")
        .output()
        .expect("?")
      // .expect("failed to execute process")
    })
    .collect();

  println!("processes {:?}", processes);
}
