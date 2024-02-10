// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use chrono::offset::Utc;
use chrono::DateTime;
use std::{
    fs::{self, DirEntry},
    io,
    path::{Path, PathBuf},
};

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord)]
pub struct DirectoryEntity {
    pub name: String,
    pub path: PathBuf,
    pub created_at: String,
    pub size: Option<u64>,
    pub is_dir: bool,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord)]
pub struct DirectoryContent {
    pub data: Vec<DirectoryEntity>,
    pub absolute_path: PathBuf,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord)]
pub struct FileEntity {
    pub content: String,
    pub path: PathBuf,
    pub extension: String,
}

#[tauri::command]
fn open_dir(path_string: &str) -> DirectoryContent {
    let mut vec: Vec<DirectoryEntity> = Vec::new();
    let path = Path::new(path_string);
    let absolute_path = fs::canonicalize(&path).unwrap();

    match read_dir(path) {
        Ok(res) => vec = res,
        Err(error) => println!("Error: {:?}", error),
    };

    DirectoryContent {
        data: vec,
        absolute_path,
    }
}

#[tauri::command]
fn open_file(path_string: &str) -> FileEntity {
    let mut content = String::new();
    let path = Path::new(path_string);

    match read_file(path) {
        Ok(res) => content = res,
        Err(error) => println!("Error: {:?}", error),
    };

    FileEntity {
        content,
        path: path.to_path_buf(),
        extension: "".into(),
    }
}

fn read_dir(dir: &Path) -> Result<Vec<DirectoryEntity>, io::Error> {
    let mut vec: Vec<DirectoryEntity> = Vec::new();
    if dir.is_dir() {
        for entry in fs::read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();
            let absolute_path = fs::canonicalize(&path)?;
            let is_dir = path.is_dir();
            let system_time = entry.metadata()?.created()?;
            let datetime: DateTime<Utc> = system_time.into();

            let size = match entry_size(&entry) {
                Ok(entry_size) => entry_size,
                Err(error) => {
                    println!("Error {:?}", error);
                    0
                }
            };
            vec.push(DirectoryEntity {
                name: entry.file_name().into_string().unwrap(),
                path: absolute_path,
                created_at: datetime.format("%d/%m/%Y %T").to_string(),
                size: Some(size),
                is_dir,
            })
        }
    }
    Ok(vec)
}

fn read_file(file: &Path) -> Result<String, io::Error> {
    let mut content = String::new();

    if file.is_file() {
        content = fs::read_to_string(file)?;
    }

    Ok(content)
}

fn entry_size(entry: &DirEntry) -> io::Result<u64> {
    let mut size: u64 = 0;

    if entry.path().is_file() {
        size = entry.metadata()?.len();
    } else {
        for entity in fs::read_dir(entry.path())? {
            let entity = entity?;

            size += entry_size(&entity)?;
        }
    }

    Ok(size)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_dir, open_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
