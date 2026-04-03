<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Roles
        $administrador = Role::create(['name' => 'administrador']);
        $admin_empresa = Role::create(['name' => 'admin_empresa']);
        $empleado = Role::create(['name' => 'empleado']);

        
        $permisos = [
            // Empresas
            'ver-empresas',
            'crear-empresa',
            'editar-empresa',
            'eliminar-empresa',
            
            // Rubros
            'ver-rubros',
            'crear-rubro',
            'editar-rubro',
            'eliminar-rubro',
            
            // Ofertas
            'ver-todas-ofertas',
            'aprobar-oferta',
            'rechazar-oferta',
            'ver-ofertas-propias',
            'crear-oferta',
            'editar-oferta',
            'eliminar-oferta',
            
            // Empleados
            'ver-empleados',
            'crear-empleado',
            'editar-empleado',
            'eliminar-empleado',
            
            // Cupones
            'ver-todos-cupones',
            'canjear-cupon',
            
            // Clientes
            'ver-clientes',
        ];

        foreach ($permisos as $permiso) {
            Permission::create(['name' => $permiso]);
        }
        $administrador->givePermissionTo(Permission::all());

        // Empresa puede gestionar sus ofertas y empleados
        $admin_empresa->givePermissionTo([
            'ver-ofertas-propias',
            'crear-oferta',
            'editar-oferta',
            'eliminar-oferta',
            'ver-empleados',
            'crear-empleado',
            'editar-empleado',
            'eliminar-empleado',
        ]);

        $empleado->givePermissionTo([
            'canjear-cupon',
        ]);
    }
}