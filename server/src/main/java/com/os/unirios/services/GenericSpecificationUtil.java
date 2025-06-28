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

        // Converte a string JSON em um Map<String, String>
        final Map<String, String> mapFilters;
        ObjectMapper objectMapper = new ObjectMapper();

        Page<T> list = null;
        try {
            mapFilters = objectMapper.readValue(filter, new TypeReference<Map<String, String>>() {});

            Pageable pageable = PageRequest.of(page, linesPerPage, Sort.Direction.valueOf(direction), orderBy);

            Specification<T> spec = (root, query, criteriaBuilder) -> {
                List<Predicate> predicates = new ArrayList<>();
                mapFilters.forEach(
                        (field, value) -> predicates.add(criteriaBuilder.like(root.get(field), "%" + value + "%")));
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            };

            list = repository.findAll(spec, pageable);

        } catch (IOException e) {
            e.printStackTrace();
           
        }

        return list;
    }

}
