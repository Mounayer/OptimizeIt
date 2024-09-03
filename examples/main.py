def max_product(numbers):
    max_product = float('-inf')
    n = len(numbers)
    for i in range(n):
        for j in range(i + 1, n):
            product = numbers[i] * numbers[j]
            if product > max_product:
                max_product = product
    return max_product