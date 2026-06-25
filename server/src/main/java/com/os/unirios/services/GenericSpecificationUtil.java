package com.os.unirios.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.criteria.Predicate;

public class GenericSpecificationUtil<T> {

    public Page<T> findWithFilters(
            Integer page,
            Integer linesPerPage,
            String orderBy,
            String direction,
            String filter,
            JpaSpecificationExecutor<T> repository) {

        final Map<String, Object> mapFilters; // Alterado para Map<String, Object>
        ObjectMapper objectMapper = new ObjectMapper();

        Page<T> list = null;
        try {
            // Alterado para TypeReference<Map<String, Object>> para aceitar objetos
            mapFilters = objectMapper.readValue(filter, new TypeReference<Map<String, Object>>() {});

            Pageable pageable = PageRequest.of(page, linesPerPage, Sort.Direction.valueOf(direction), orderBy);

            Specification<T> spec = (root, query, criteriaBuilder) -> {
                List<Predicate> predicates = new ArrayList<>();
                mapFilters.forEach((field, value) -> {
                    // AQUI ESTÁ A CORREÇÃO
                    // Se o valor for um Map (como {"id":123}), é um relacionamento
                    if (value instanceof Map) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> relatedObject = (Map<String, Object>) value;
                        // Filtramos pelo ID do objeto relacionado
                        if (relatedObject.containsKey("id")) {
                            predicates.add(criteriaBuilder.equal(root.get(field).get("id"), relatedObject.get("id")));
                        }
                    } else { // Senão, é um campo normal (String, número, etc.)
                        Class<?> fieldType = root.get(field).getJavaType();
                        if (fieldType.equals(String.class)) {
                            predicates.add(criteriaBuilder.like(root.get(field), "%" + value.toString() + "%"));
                        } else {
                            predicates.add(criteriaBuilder.equal(root.get(field), value));
                        }
                    }
                });
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            };

            list = repository.findAll(spec, pageable);

        } catch (IOException e) {
            e.printStackTrace();
        }

        return list;
    }
}