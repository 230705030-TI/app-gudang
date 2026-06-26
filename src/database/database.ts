import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

export interface InventoryItem {
  id: number;
  name: string;
  stock: number;
  image_uri: string | null;
}

const db = SQLite.openDatabaseSync("inventory.db");

export const initDB = (): void => {
  db.execSync(
    `CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      stock INTEGER NOT NULL,
      image_uri TEXT
    );`,
  );
};

export const getInventory = (): InventoryItem[] => {
  return db.getAllSync<InventoryItem>("SELECT * FROM inventory;");
};

export const addItem = async (
  name: string,
  stock: number,
  tempImageUri: string | null,
): Promise<number | string> => {
  let permanentUri: string | null = null;

  if (tempImageUri) {
    const fileName = tempImageUri.split("/").pop() || "image.jpg";
    // Menentukan lokasi penyimpanan permanen di dokumen lokal aplikasi
    permanentUri = `${FileSystem.documentDirectory}${fileName}`;

    try {
      // Menyalin file dari URI sementara ke penyimpanan permanen
      await FileSystem.copyAsync({
        from: tempImageUri,
        to: permanentUri,
      });
    } catch (error) {
      console.error("Gagal menyimpan gambar:", error);
      permanentUri = null; // Tetap simpan data tanpa gambar jika gagal copy
    }
  }

  const result = db.runSync(
    "INSERT INTO inventory (name, stock, image_uri) VALUES (?, ?, ?);",
    [name, stock, permanentUri],
  );

  return result.lastInsertRowId;
};

export const updateItem = async (
  id: number,
  name: string,
  stock: number,
  newTempUri: string | null,
  oldUri: string | null,
): Promise<void> => {
  let permanentUri: string | null = oldUri;

  // Jika ada gambar baru yang dipilih dan berbeda dari gambar lama
  if (newTempUri && newTempUri !== oldUri) {
    // Hapus gambar lama terlebih dahulu jika ada
    if (oldUri) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(oldUri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(oldUri);
        }
      } catch (error) {
        console.error("Gagal menghapus gambar lama:", error);
      }
    }

    const fileName = newTempUri.split("/").pop() || "image.jpg";
    permanentUri = `${FileSystem.documentDirectory}${fileName}`;

    try {
      await FileSystem.copyAsync({
        from: newTempUri,
        to: permanentUri,
      });
    } catch (error) {
      console.error("Gagal menyalin gambar baru:", error);
      permanentUri = oldUri; // Kembalikan ke uri lama jika gagal
    }
  }

  db.runSync(
    "UPDATE inventory SET name = ?, stock = ?, image_uri = ? WHERE id = ?;",
    [name, stock, permanentUri, id],
  );
};

export const deleteItem = async (
  id: number,
  imageUri: string | null,
): Promise<void> => {
  if (imageUri) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(imageUri);
      }
    } catch (error) {
      console.error("Gagal menghapus file gambar saat hapus item:", error);
    }
  }

  db.runSync("DELETE FROM inventory WHERE id = ?;", [id]);
};
