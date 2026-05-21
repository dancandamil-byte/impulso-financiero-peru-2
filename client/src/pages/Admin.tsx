import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Solicitud {
  fecha: string;
  nombre: string;
  dni: string;
  telefono: string;
  direccion: string;
  negocio: string;
  ingresos: number;
  montoSolicitado: number;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
}

export default function AdminPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [actualizando, setActualizando] = useState<string | null>(null);

  useEffect(() => {
    cargarSolicitudes();
    // Actualizar cada 10 segundos
    const intervalo = setInterval(cargarSolicitudes, 10000);
    return () => clearInterval(intervalo);
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const response = await fetch('/api/prestamos');
      if (response.ok) {
        const data = await response.json();
        setSolicitudes(data);
      }
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
    } finally {
      setCargando(false);
    }
  };

  const actualizarEstado = async (dni: string, nuevoEstado: string) => {
    setActualizando(dni);
    try {
      const response = await fetch(`/api/prestamos/${dni}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (response.ok) {
        await cargarSolicitudes();
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
    } finally {
      setActualizando(null);
    }
  };

  const solicitudesFiltradas = solicitudes.filter((s) => {
    if (filtroEstado === 'todos') return true;
    return s.estado === filtroEstado;
  });

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rechazado':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return <Badge variant="default" className="bg-green-600">Aprobado</Badge>;
      case 'rechazado':
        return <Badge variant="destructive">Rechazado</Badge>;
      default:
        return <Badge variant="secondary">Pendiente</Badge>;
    }
  };

  const estadisticas = {
    total: solicitudes.length,
    pendientes: solicitudes.filter((s) => s.estado === 'pendiente').length,
    aprobadas: solicitudes.filter((s) => s.estado === 'aprobado').length,
    rechazadas: solicitudes.filter((s) => s.estado === 'rechazado').length,
    montoTotal: solicitudes.reduce((sum, s) => sum + s.montoSolicitado, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Panel Administrativo</h1>
          <p className="text-gray-600">Gestiona las solicitudes de préstamo de Impulso Financiero</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{estadisticas.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-600">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{estadisticas.pendientes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-600">Aprobadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{estadisticas.aprobadas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-600">Rechazadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{estadisticas.rechazadas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-indigo-600">Monto Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">
                S/ {estadisticas.montoTotal.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtro */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Solicitudes</CardTitle>
            <CardDescription>Filtrar por estado</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
                <SelectItem value="aprobado">Aprobadas</SelectItem>
                <SelectItem value="rechazado">Rechazadas</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Tabla */}
        <Card>
          <CardContent className="p-0">
            {cargando ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : solicitudesFiltradas.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No hay solicitudes con el estado seleccionado
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>DNI</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Negocio</TableHead>
                      <TableHead>Ingresos</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitudesFiltradas.map((solicitud) => (
                      <TableRow key={solicitud.dni}>
                        <TableCell className="text-sm">
                          {new Date(solicitud.fecha).toLocaleDateString('es-PE')}
                        </TableCell>
                        <TableCell className="font-medium">{solicitud.nombre}</TableCell>
                        <TableCell>{solicitud.dni}</TableCell>
                        <TableCell>{solicitud.telefono}</TableCell>
                        <TableCell className="max-w-xs truncate">{solicitud.negocio}</TableCell>
                        <TableCell>S/ {solicitud.ingresos.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold">
                          S/ {solicitud.montoSolicitado.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(solicitud.estado)}
                            {getStatusBadge(solicitud.estado)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {solicitud.estado === 'pendiente' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => actualizarEstado(solicitud.dni, 'aprobado')}
                                disabled={actualizando === solicitud.dni}
                              >
                                {actualizando === solicitud.dni ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  'Aprobar'
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => actualizarEstado(solicitud.dni, 'rechazado')}
                                disabled={actualizando === solicitud.dni}
                              >
                                {actualizando === solicitud.dni ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  'Rechazar'
                                )}
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
