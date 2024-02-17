// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use chrono::offset::Utc;
use chrono::DateTime;
use std::{
    fs, io,
    path::{Path, PathBuf},
};
use thiserror;

use serde::{Deserialize, Serialize};

#[derive(Debug, thiserror::Error)]
enum ViewError {
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

impl serde::Serialize for ViewError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord)]
pub struct DirectoryEntity {
    pub name: String,
    pub path: PathBuf,
    pub created_at: String,
    // pub size: Option<u64>,
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
fn open_dir(path_string: &str) -> Result<DirectoryContent, ViewError> {
    let path = Path::new(path_string);

    let vec = match read_dir(path) {
        Ok(res) => res,
        Err(error) => return Err(ViewError::Io(error)),
    };
    let absolute_path = match fs::canonicalize(&path) {
        Ok(path) => path,
        Err(error) => return Err(ViewError::Io(error)),
    };

    Ok(DirectoryContent {
        data: vec,
        absolute_path,
    })
}

#[tauri::command]
fn open_file(path_string: &str) -> Result<FileEntity, ViewError> {
    let path = Path::new(path_string);

    let content = match read_file(path) {
        Ok(res) => res,
        Err(error) => return Err(ViewError::Io(error)),
    };

    Ok(FileEntity {
        content,
        path: path.to_path_buf(),
        extension: "".into(),
    })
}

#[tauri::command]
fn create_file_command(path_string: &str) -> Result<(), ViewError> {
    let path = Path::new(path_string);

    match create_file(path) {
        Ok(_) => Ok(()),
        Err(error) => return Err(ViewError::Io(error)),
    }
}

#[tauri::command]
fn update_file_command(path_string: &str, content: &str) -> Result<(), ViewError> {
    let path = Path::new(path_string);

    match update_file(path, content) {
        Ok(_) => Ok(()),
        Err(error) => return Err(ViewError::Io(error)),
    }
}

#[tauri::command]
fn create_dir_command(path_string: &str) -> Result<(), ViewError> {
    let path = Path::new(path_string);

    match create_dir(path) {
        Ok(_) => Ok(()),
        Err(error) => return Err(ViewError::Io(error)),
    }
}

#[tauri::command]
fn quit_app(app_handle: tauri::AppHandle) {
    app_handle.exit(1);
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

            // let size = match entry_size(&entry) {
            //     Ok(entry_size) => entry_size,
            //     Err(error) => {
            //         println!("Error {:?}", error);
            //         0
            //     }
            // };

            vec.push(DirectoryEntity {
                name: entry.file_name().into_string().unwrap(),
                path: absolute_path,
                created_at: datetime.format("%d/%m/%Y %T").to_string(),
                // size: Some(size),
                is_dir,
            })
        }
    }
    Ok(vec)
}

fn read_file(file: &Path) -> Result<String, io::Error> {
    match fs::read_to_string(file) {
        Ok(data) => Ok(data),
        Err(error) => Err(error),
    }
}

fn create_file(path: &Path) -> Result<(), io::Error> {
    if path.is_file() {
        return Err(io::Error::new(
            io::ErrorKind::AlreadyExists,
            "File already exists",
        ));
    }

    let _ = fs::File::create(path)?;

    Ok(())
}

fn create_dir(path: &Path) -> Result<(), io::Error> {
    if path.is_dir() {
        return Err(io::Error::new(
            io::ErrorKind::AlreadyExists,
            "Directory already exists",
        ));
    }

    let _ = fs::create_dir(path)?;

    Ok(())
}

fn update_file(path: &Path, content: &str) -> Result<(), io::Error> {
    if !path.is_file() {
        return Err(io::Error::new(
            io::ErrorKind::AlreadyExists,
            "File already exists",
        ));
    }

    fs::write(path, content)?;

    Ok(())
}

// fn entry_size(entry: &DirEntry) -> io::Result<u64> {
//     let mut size: u64 = 0;

//     if entry.path().is_file() {
//         size = entry.metadata()?.len();
//     } else {
//         for entity in fs::read_dir(entry.path())? {
//             let entity = entity?;

//             size += entry_size(&entity)?;
//         }
//     }

//     Ok(size)
// }

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_dir,
            open_file,
            quit_app,
            create_file_command,
            create_dir_command,
            update_file_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
