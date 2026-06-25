package com.os.unirios.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.os.unirios.services.FileStorageService;

/**
 * Controller para upload e gerenciamento de arquivos
 * Integração com MinIO: https://storage.triadevsolution.cloud
 */
@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    /**
     * Upload de arquivo para o MinIO
     * @param file Arquivo a ser enviado
     * @param folder Pasta de destino (opcional, padrão: "uploads")
     * @return Informações do arquivo enviado
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "uploads") String folder) {
        
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Arquivo está vazio");
            }

            // Validar tipo de arquivo (exemplo: apenas imagens e PDFs)
            String contentType = file.getContentType();
            if (!isValidFileType(contentType)) {
                return ResponseEntity.badRequest().body("Tipo de arquivo não permitido: " + contentType);
            }

            // Validar tamanho (máximo 10MB)
            if (file.getSize() > 10 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("Arquivo muito grande. Máximo: 10MB");
            }

            String fileName = fileStorageService.uploadFile(file, folder);
            String publicUrl = fileStorageService.getPublicUrl(fileName);
            String downloadUrl = fileStorageService.getPresignedUrl(fileName, 60); // 1 hora

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Arquivo enviado com sucesso");
            response.put("fileName", fileName);
            response.put("originalName", file.getOriginalFilename());
            response.put("publicUrl", publicUrl);
            response.put("downloadUrl", downloadUrl);
            response.put("size", file.getSize());
            response.put("contentType", contentType);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Erro ao fazer upload: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    /**
     * Gerar nova URL de download para um arquivo
     * @param fileName Nome do arquivo no storage
     * @param expiryMinutes Tempo de expiração em minutos (padrão: 60)
     * @return URL de download
     */
    @GetMapping("/download-url")
    public ResponseEntity<?> getDownloadUrl(
            @RequestParam("fileName") String fileName,
            @RequestParam(value = "expiryMinutes", defaultValue = "60") int expiryMinutes) {
        
        try {
            String downloadUrl = fileStorageService.getPresignedUrl(fileName, expiryMinutes);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("downloadUrl", downloadUrl);
            response.put("expiryMinutes", expiryMinutes);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Erro ao gerar URL de download: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    /**
     * Deletar arquivo do storage
     * @param fileName Nome do arquivo no storage
     * @return Confirmação da deleção
     */
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFile(@RequestParam("fileName") String fileName) {
        try {
            fileStorageService.deleteFile(fileName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Arquivo deletado com sucesso");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Erro ao deletar arquivo: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    /**
     * Validar se o tipo de arquivo é permitido
     * @param contentType Tipo MIME do arquivo
     * @return true se o tipo é válido
     */
    private boolean isValidFileType(String contentType) {
        if (contentType == null) return false;
        
        return contentType.startsWith("image/") || 
               contentType.equals("application/pdf") ||
               contentType.startsWith("text/") ||
               contentType.equals("application/msword") ||
               contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
               contentType.equals("application/vnd.ms-excel") ||
               contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }
}