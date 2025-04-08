from indic_transliteration.sanscript import transliterate
from indic_transliteration.sanscript import SCHEMES, HK, TAMIL

# Replace 'your_name' with your name
your_name = "Arun"

# Transliterate from Harvard-Kyoto (HK) or ITRANS to Tamil
tamil_name = transliterate(your_name, HK, TAMIL)

print("Original Name:", your_name)
print("Tamil Script:", tamil_name)
