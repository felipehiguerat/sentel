# Usamos la imagen oficial de Miniconda3
FROM continuumio/miniconda3

# Evita que Python genere archivos .pyc y buffer de logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copiamos el archivo de entorno
COPY environment.yaml .

# 1. Creamos el entorno definido en el yaml
# 2. Limpiamos cache para reducir el tamaño de la imagen
RUN conda env create -f environment.yaml && \
    conda clean -afy

# TRUCO CLAVE: Agregamos el entorno al PATH.
# Así, cuando ejecutemos "python" o "uvicorn", usará el del entorno 'network-watcher'
# sin necesidad de hacer "conda activate".
ENV PATH /opt/conda/envs/network-watcher/bin:$PATH

# Copiamos el código
COPY . .

# Exponemos el puerto
EXPOSE 8000

# Ejecutamos la app
# Como modificamos el PATH, el sistema encuentra 'uvicorn' automáticamente
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]