import React, { useState, useEffect } from 'react';
import { Checkbox, Button, Table, Input, Toaster, toast, Select } from "@medusajs/ui";
import { Skeleton } from "../common/skeleton";

interface FileModalProps {
    onClose: () => void;
    setSelectedFiles: (selectedFiles: { file_id: number | string; file_name: string; language: string; document_type: string; }[]) => void;
}

export const FileModal: React.FC<FileModalProps> = ({ onClose, setSelectedFiles }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState<Array<{ id: number | string; file_id: number | string; file_name: string; language: string; document_type: string }>>([]);
    const [selectedRows, setSelectedRows] = useState<Record<number | string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

    const [showInstruction, setShowInstruction] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);
    const [showComplianceCard, setShowComplianceCard] = useState(false);
    const [showOther, setShowOther] = useState(false);

    type Language = {
        label: string;
        value: string;
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:9000/admin/attachments", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const dataFromResponse = await response.json();
            const data = dataFromResponse.attachments;
            console.log('Fetched data:', data);

            const uniqueLanguages: any[] = Array.from(new Set(data.map(row => row.language)))
                .map(lang => ({ label: lang, value: lang }));

            setLanguages(uniqueLanguages);
            setRows(data);

            const initialSelectionState = data.reduce((acc: Record<number | string, boolean>, row: { file_id: number | string }) => {
                acc[row.file_id] = false; 
                return acc;
            }, {});
            setSelectedRows(initialSelectionState);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSelectRow = (file_id: number | string) => {
        setSelectedRows((prev) => ({
            ...prev,
            [file_id]: !prev[file_id],
        }));
    };

    const handleConfirm = () => {
        const selectedFiles = rows.filter(row => selectedRows[row.file_id]).map(row => ({
            file_id: row.file_id, 
            file_name: row.file_name,
            language: row.language,
            document_type: row.document_type,
        }));

        console.log('Selected files:', selectedFiles);
        setSelectedFiles(selectedFiles);
        let productId = getProductIdFromUrl();
        saveDataInDatabase(selectedFiles, productId);
        onClose();
    };

    const getProductIdFromUrl = () => {
        let productUrl = location.href;
        let splittedUrl = productUrl.split('/');
        return splittedUrl[splittedUrl.length - 1];
    };

    const saveDataInDatabase = async (selectedFiles, productId) => {
        try {
            const attachments = selectedFiles.map(file => ({
                file_id: file.file_id,
                file_name: file.file_name,
                language: file.language,
                document_type: file.document_type
            }));

            console.log('Saving attachments:', attachments); 

            const response = await fetch(`http://localhost:9000/admin/attachments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    product_id: productId, 
                    attachments: attachments 
                }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to save data in database.");
            }

            const data = await response.json();
            console.log("Data saved in database:", data);

            toast.info("Data saved successfully.", {
                description: "Attachments have been added to the database.",
            });
        } catch (error) {
            console.error("Error saving data in database:", error);
            toast.error("Failed to save data.", {
                description: "An error occurred while saving to the database.",
            });
        }
    };

    const filteredRows = rows.filter(row => {
        const matchesSearchTerm = row.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.document_type.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDocumentType = (
            (!showInstruction && !showCertificate && !showComplianceCard && !showOther) ||
            (showInstruction && row.document_type === "instruction") ||
            (showCertificate && row.document_type === "certificate") ||
            (showComplianceCard && row.document_type === "compliance_card") ||
            (showOther && row.document_type === "other")
        );

        const matchesLanguage = selectedLanguage ? row.language === selectedLanguage : true;

        return matchesSearchTerm && matchesDocumentType && matchesLanguage;
    });

    return (
        <>
            {isLoading ? (
                <Skeleton className="loading" />
            ) : (
                <>
                    <Toaster />
                    <div className="absolute left-[70px] top-[57px] flex flex-row gap-10 items-center">
                        <Input
                            className="w-[300px]"
                            placeholder="Start typing ..."
                            id="files-search-bar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="flex flex-row gap-2 items-center w-[175px]">
                            <Select onValueChange={(value) => {
                                if (value === "clear") {
                                    setSelectedLanguage(null);
                                } else {
                                    setSelectedLanguage(value);
                                }
                            }}>
                                <Select.Trigger>
                                    <Select.Value placeholder="Select a language" />
                                </Select.Trigger>
                                <Select.Content>
                                    <Select.Item key="clear" value="clear">Clear Selection</Select.Item>
                                    {languages.map((item) => (
                                        <Select.Item key={item.value} value={item.value}>
                                            {item.label}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <Checkbox
                                checked={showInstruction}
                                onCheckedChange={() => setShowInstruction(prev => !prev)}
                            />
                            <span>instruction</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <Checkbox
                                checked={showCertificate}
                                onCheckedChange={() => setShowCertificate(prev => !prev)}
                            />
                            <span>certificate</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <Checkbox
                                checked={showComplianceCard}
                                onCheckedChange={() => setShowComplianceCard(prev => !prev)}
                            />
                            <span>compliance card</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <Checkbox
                                checked={showOther}
                                onCheckedChange={() => setShowOther(prev => !prev)}
                            />
                            <span>other</span>
                        </div>
                    </div>

                    <div style={{ width: '100%', maxHeight: '80vh', paddingBottom: '250px', overflowY: 'auto' }}>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell></Table.HeaderCell>
                                    <Table.HeaderCell>File Name</Table.HeaderCell>
                                    <Table.HeaderCell>Language</Table.HeaderCell>
                                    <Table.HeaderCell>Document Type</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {filteredRows.map((row) => (
                                    <Table.Row key={row.file_id}>
                                        <Table.Cell>
                                            <Checkbox
                                                onCheckedChange={() => toggleSelectRow(row.file_id)}
                                                aria-label={`Select ${row.file_name}`}
                                                checked={!!selectedRows[row.file_id]}
                                            />
                                        </Table.Cell>
                                        <Table.Cell>{row.file_name}</Table.Cell>
                                        <Table.Cell>{row.language}</Table.Cell>
                                        <Table.Cell>{row.document_type}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                    <Button className='absolute top-[6px] right-[20px]' onClick={handleConfirm}>Save</Button>
                </>
            )}
        </>
    );
};