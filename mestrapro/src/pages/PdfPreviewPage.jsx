// Em: src/pages/PdfPreviewPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Importe os estilos
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import axiosClient from '../api/axiosClient';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function PdfPreviewPage() {
    const { planId } = useParams(); // Pega o ID do plano da URL
    const [pdfUrl, setPdfUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const response = await axiosClient.get(
                    `/api/v1/${planId}/download`,
                    { responseType: 'blob' } // Pede o arquivo como um Blob
                );

                // Cria uma URL local para o arquivo Blob recebido
                const fileURL = URL.createObjectURL(response.data);
                setPdfUrl(fileURL);
            } catch (err) {
                console.error("Erro ao buscar o PDF:", err);
                setError("Não foi possível carregar o PDF. Verifique se você tem permissão para acessá-lo.");
            } finally {
                setIsLoading(false);
            }
        };

        if (planId) {
            fetchPdf();
        }
    }, [planId]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Carregando preview...</Typography>
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        // Este Box é o container principal da página e vai se esticar
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            {pdfUrl ? (
                // O Viewer agora está dentro de um container flex que preenche o espaço
                <div style={{ height: '1000px', width: '1000px%' }}>
                    <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} theme="dark" />
                    <p>
                        lkjhgfdsaderthjkhgfds
                    </p>
                </div>
            ) : (
                <Typography>Nenhum PDF para exibir.</Typography>
            )}
        </Worker>
    );
}