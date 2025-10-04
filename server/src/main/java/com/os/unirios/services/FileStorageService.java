package com.os.unirios.services;

import java.io.InputStream;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.os.unirios.config.MinioConfig;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.http.Method;

/**
 * Serviço para gerenciar uploads de arquivos no MinIO
 * Armazenamento: https://storage.triadevsolution.cloud
 */
@Service
public class FileStorageService {

    @Autowired
    private MinioClient minioClient;

    @Autowired
    private MinioConfig minioConfig;

    /**
     * Faz upload de um arquivo para o MinIO
     * @param file Arquivo a ser enviado
     * @param folder Pasta de destino no bucket
     * @return Nome do arquivo no storage
     */
    public String uploadFile(MultipartFile file, String folder) {
        try {
            String fileName = generateFileName(file.getOriginalFilename());
            String objectName = folder + "/" + fileName;

            InputStream inputStream = file.getInputStream();
            
            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(minioConfig.getBucketName())
                    .object(objectName)
                    .stream(inputStream, file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build()
            );

            return objectName;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao fazer upload do arquivo: " + e.getMessage(), e);
        }
    }

    /**
     * Gera uma URL pré-assinada para download do arquivo
     * @param fileName Nome do arquivo no storage
     * @param expiryInMinutes Tempo de expiração da URL em minutos
     * @return URL pré-assinada
     */
    public String getPresignedUrl(String fileName, int expiryInMinutes) {
        try {
            return minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                    .method(Method.GET)
                    .bucket(minioConfig.getBucketName())
                    .object(fileName)
                    .expiry(expiryInMinutes, TimeUnit.MINUTES)
                    .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar URL de download: " + e.getMessage(), e);
        }
    }

    /**
     * Remove um arquivo do MinIO
     * @param fileName Nome do arquivo no storage
     */
    public void deleteFile(String fileName) {
        try {
            minioClient.removeObject(
                RemoveObjectArgs.builder()
                    .bucket(minioConfig.getBucketName())
                    .object(fileName)
                    .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Erro ao deletar arquivo: " + e.getMessage(), e);
        }
    }

    /**
     * Gera um nome único para o arquivo
     * @param originalFileName Nome original do arquivo
     * @return Nome único com UUID
     */
    private String generateFileName(String originalFileName) {
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        return UUID.randomUUID().toString() + extension;
    }

    /**
     * Retorna a URL pública do arquivo
     * @param fileName Nome do arquivo no storage
     * @return URL pública do arquivo
     */
    public String getPublicUrl(String fileName) {
        return minioConfig.getEndpoint() + "/" + minioConfig.getBucketName() + "/" + fileName;
    }
}