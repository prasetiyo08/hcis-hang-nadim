// src/services/employeeService.js - Version without Storage
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, fileToBase64, validateFile } from './firebase';

class EmployeeService {
  // Get all employees
  static async getAllEmployees() {
    try {
      console.log('📋 Fetching all employees...');
      
      const q = query(
        collection(db, 'employees'), 
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const employees = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`✅ Fetched ${employees.length} employees`);
      return employees;
    } catch (error) {
      console.error('❌ Failed to fetch employees:', error);
      throw new Error('Gagal mengambil data karyawan: ' + error.message);
    }
  }

  // Get employee by ID
  static async getEmployeeById(id) {
    try {
      console.log('👤 Fetching employee:', id);
      
      const docRef = doc(db, 'employees', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const employee = {
          id: docSnap.id,
          ...docSnap.data()
        };
        console.log('✅ Employee found');
        return employee;
      } else {
        throw new Error('Karyawan tidak ditemukan');
      }
    } catch (error) {
      console.error('❌ Failed to fetch employee:', error);
      throw new Error('Gagal mengambil data karyawan: ' + error.message);
    }
  }

  // Add new employee (with base64 file storage)
  static async addEmployee(employeeData, files = {}) {
    try {
      console.log('➕ Adding new employee...');
      
      // Convert files to base64 (local storage alternative)
      const processedFiles = {};
      for (const [key, file] of Object.entries(files)) {
        if (file && file instanceof File) {
          try {
            console.log(`📁 Processing ${key}...`);
            
            // Validate file
            const validation = validateFile(file, 2, ['image/jpeg', 'image/png', 'image/gif']);
            if (!validation.valid) {
              console.warn(`⚠️ ${key} validation failed:`, validation.error);
              continue;
            }
            
            // Convert to base64
            const base64 = await fileToBase64(file);
            processedFiles[key] = {
              data: base64,
              name: file.name,
              type: file.type,
              size: file.size,
              uploadedAt: new Date().toISOString()
            };
            console.log(`✅ ${key} processed successfully`);
          } catch (fileError) {
            console.error(`❌ Failed to process ${key}:`, fileError);
            // Continue without this file
          }
        }
      }

      // Prepare employee data
      const employeeDoc = {
        ...employeeData,
        documents: processedFiles,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active'
      };

      // Add employee to Firestore
      const docRef = await addDoc(collection(db, 'employees'), employeeDoc);
      
      const newEmployee = {
        id: docRef.id,
        ...employeeDoc
      };
      
      console.log('✅ Employee added successfully');
      return newEmployee;
    } catch (error) {
      console.error('❌ Failed to add employee:', error);
      throw new Error('Gagal menambahkan karyawan: ' + error.message);
    }
  }

  // Update employee (with base64 file storage)
  static async updateEmployee(id, employeeData, files = {}) {
    try {
      console.log('✏️ Updating employee:', id);
      
      // Process new files if provided
      const processedFiles = {};
      for (const [key, file] of Object.entries(files)) {
        if (file && file instanceof File) {
          try {
            console.log(`📁 Processing new ${key}...`);
            
            // Validate file
            const validation = validateFile(file, 2, ['image/jpeg', 'image/png', 'image/gif']);
            if (!validation.valid) {
              console.warn(`⚠️ ${key} validation failed:`, validation.error);
              continue;
            }
            
            // Convert to base64
            const base64 = await fileToBase64(file);
            processedFiles[key] = {
              data: base64,
              name: file.name,
              type: file.type,
              size: file.size,
              uploadedAt: new Date().toISOString()
            };
            console.log(`✅ ${key} processed successfully`);
          } catch (fileError) {
            console.error(`❌ Failed to process ${key}:`, fileError);
            // Continue without this file
          }
        }
      }

      // Prepare update data
      const updateData = {
        ...employeeData,
        updatedAt: serverTimestamp()
      };

      // Merge new files with existing documents
      if (Object.keys(processedFiles).length > 0) {
        updateData.documents = {
          ...employeeData.documents,
          ...processedFiles
        };
      }

      // Update employee in Firestore
      const docRef = doc(db, 'employees', id);
      await updateDoc(docRef, updateData);

      const updatedEmployee = {
        id,
        ...updateData
      };
      
      console.log('✅ Employee updated successfully');
      return updatedEmployee;
    } catch (error) {
      console.error('❌ Failed to update employee:', error);
      throw new Error('Gagal mengupdate karyawan: ' + error.message);
    }
  }

  // Delete employee
  static async deleteEmployee(id) {
    try {
      console.log('🗑️ Deleting employee:', id);
      
      // Delete employee document from Firestore
      // Files are stored as base64 in document, so they'll be deleted automatically
      await deleteDoc(doc(db, 'employees', id));
      
      console.log('✅ Employee deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete employee:', error);
      throw new Error('Gagal menghapus karyawan: ' + error.message);
    }
  }

  // Search employees
  static async searchEmployees(searchTerm) {
    try {
      console.log('🔍 Searching employees:', searchTerm);
      
      // Get all employees first (Firestore doesn't support full-text search easily)
      const allEmployees = await this.getAllEmployees();
      
      // Filter employees based on search term
      const filteredEmployees = allEmployees.filter(employee => {
        const searchLower = searchTerm.toLowerCase();
        return (
          employee.personalInfo?.fullName?.toLowerCase().includes(searchLower) ||
          employee.personalInfo?.nip?.toLowerCase().includes(searchLower) ||
          employee.personalInfo?.email?.toLowerCase().includes(searchLower) ||
          employee.workInfo?.department?.toLowerCase().includes(searchLower) ||
          employee.workInfo?.position?.toLowerCase().includes(searchLower)
        );
      });
      
      console.log(`✅ Found ${filteredEmployees.length} matching employees`);
      return filteredEmployees;
    } catch (error) {
      console.error('❌ Failed to search employees:', error);
      throw new Error('Gagal mencari karyawan: ' + error.message);
    }
  }

  // Get employees by department
  static async getEmployeesByDepartment(department) {
    try {
      console.log('🏢 Fetching employees by department:', department);
      
      const q = query(
        collection(db, 'employees'),
        where('workInfo.department', '==', department),
        orderBy('personalInfo.fullName', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const employees = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`✅ Found ${employees.length} employees in ${department}`);
      return employees;
    } catch (error) {
      console.error('❌ Failed to fetch employees by department:', error);
      // Fallback to search method
      const allEmployees = await this.getAllEmployees();
      return allEmployees.filter(emp => emp.workInfo?.department === department);
    }
  }

  // Get employee statistics
  static async getEmployeeStats() {
    try {
      console.log('📊 Calculating employee statistics...');
      
      const employees = await this.getAllEmployees();
      
      const stats = {
        total: employees.length,
        byDepartment: {},
        byPosition: {},
        byEmploymentType: {},
        active: 0,
        inactive: 0,
        withPhotos: 0,
        withoutPhotos: 0
      };

      employees.forEach(employee => {
        // Count by department
        const dept = employee.workInfo?.department || 'Unknown';
        stats.byDepartment[dept] = (stats.byDepartment[dept] || 0) + 1;
        
        // Count by position
        const pos = employee.workInfo?.position || 'Unknown';
        stats.byPosition[pos] = (stats.byPosition[pos] || 0) + 1;
        
        // Count by employment type
        const empType = employee.workInfo?.employmentType || 'Unknown';
        stats.byEmploymentType[empType] = (stats.byEmploymentType[empType] || 0) + 1;
        
        // Count by status
        if (employee.status === 'active') {
          stats.active++;
        } else {
          stats.inactive++;
        }
        
        // Count photos
        if (employee.documents?.profilePhoto) {
          stats.withPhotos++;
        } else {
          stats.withoutPhotos++;
        }
      });
      
      console.log('✅ Employee statistics calculated');
      return stats;
    } catch (error) {
      console.error('❌ Failed to calculate employee stats:', error);
      throw new Error('Gagal menghitung statistik karyawan: ' + error.message);
    }
  }

  // Update employee photo (base64)
  static async updateEmployeePhoto(employeeId, photoFile) {
    try {
      console.log('📷 Updating employee photo:', employeeId);
      
      if (!photoFile || !(photoFile instanceof File)) {
        throw new Error('File foto tidak valid');
      }

      // Validate photo file
      const validation = validateFile(photoFile, 2, ['image/jpeg', 'image/png', 'image/gif']);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Convert to base64
      const base64 = await fileToBase64(photoFile);
      const photoData = {
        data: base64,
        name: photoFile.name,
        type: photoFile.type,
        size: photoFile.size,
        uploadedAt: new Date().toISOString()
      };

      // Update employee document
      const employeeRef = doc(db, 'employees', employeeId);
      await updateDoc(employeeRef, {
        'documents.profilePhoto': photoData,
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ Photo updated successfully');
      return photoData;
    } catch (error) {
      console.error('❌ Failed to update photo:', error);
      throw new Error('Gagal mengupdate foto: ' + error.message);
    }
  }

  // Remove employee photo
  static async removeEmployeePhoto(employeeId) {
    try {
      console.log('🗑️ Removing employee photo:', employeeId);
      
      // Remove photo from employee document
      const employeeRef = doc(db, 'employees', employeeId);
      await updateDoc(employeeRef, {
        'documents.profilePhoto': null,
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ Photo removed successfully');
    } catch (error) {
      console.error('❌ Failed to remove photo:', error);
      throw new Error('Gagal menghapus foto: ' + error.message);
    }
  }
}

export { EmployeeService };
export default EmployeeService;