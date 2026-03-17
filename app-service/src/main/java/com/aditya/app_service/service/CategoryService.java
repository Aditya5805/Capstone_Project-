package com.aditya.app_service.service;

import com.aditya.app_service.DTO.CategoryDTO;
import com.aditya.app_service.entity.Category;
import com.aditya.app_service.exception.ResourceNotFoundException;
import com.aditya.app_service.mapper.CategoryMapper;
import com.aditya.app_service.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.findByName(dto.getName()).isPresent()) {
            throw new IllegalArgumentException("Category already exists: " + dto.getName());
        }
        Category saved = categoryRepository.save(CategoryMapper.toEntity(dto));
        return CategoryMapper.toDTO(saved);
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with ID: " + id));
        return CategoryMapper.toDTO(category);
    }

    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with ID: " + id));
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        return CategoryMapper.toDTO(categoryRepository.save(category));
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with ID: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
